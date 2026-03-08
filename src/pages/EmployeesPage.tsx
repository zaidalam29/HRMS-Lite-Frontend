import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';
import { Employee, EmployeeCreate } from '../types';
import { Modal } from '../components/common/Modal';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const EmployeesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  const {
    employees,
    total,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployees,
  } = useEmployees();

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCreateEmployee = async (data: EmployeeCreate) => {
    const result = await createEmployee(data);
    if (result) {
      setShowForm(false);
      fetchEmployees();
    }
  };

  const handleUpdateEmployee = async (data: EmployeeCreate) => {
    if (editingEmployee) {
      const result = await updateEmployee(editingEmployee.employee_id, data);
      if (result) {
        setEditingEmployee(null);
        fetchEmployees();
      }
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const success = await deleteEmployee(id);
    if (success) {
      fetchEmployees();
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchTerm === '' || 
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">Manage your employees ({total} total)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchEmployees()}
          onDismiss={() => {}} 
        />
      )}

      {/* Employee List */}
      <EmployeeList
        employees={filteredEmployees}
        loading={loading}
        onEdit={setEditingEmployee}
        onDelete={handleDeleteEmployee}
      />

      {/* Create Employee Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Employee"
      >
        <EmployeeForm
          onSubmit={handleCreateEmployee}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title="Edit Employee"
      >
        {editingEmployee && (
          <EmployeeForm
            initialData={{
              employee_id: editingEmployee.employee_id,
              full_name: editingEmployee.full_name,
              email: editingEmployee.email,
              department: editingEmployee.department,
            }}
            onSubmit={handleUpdateEmployee}
            onCancel={() => setEditingEmployee(null)}
            isLoading={loading}
          />
        )}
      </Modal>
    </div>
  );
};