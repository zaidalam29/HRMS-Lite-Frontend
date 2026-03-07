import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeApi } from '../api/employees';
import { Employee, EmployeeCreate, EmployeeUpdate } from '../types';

interface UseEmployeesReturn {
  employees: Employee[];
  selectedEmployee: Employee | null;  
  total: number;
  loading: boolean;
  error: string | null;
  fetchEmployees: (params?: { skip?: number; limit?: number; department?: string }) => Promise<void>;
  getEmployee: (id: string) => Promise<Employee | null>;  // This will set selectedEmployee
  createEmployee: (data: EmployeeCreate) => Promise<Employee | null>;
  updateEmployee: (id: string, data: EmployeeUpdate) => Promise<Employee | null>;
  deleteEmployee: (id: string) => Promise<boolean>;
  clearSelectedEmployee: () => void;  
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);  
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async (params?: { skip?: number; limit?: number; department?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getAll(params);
      setEmployees(response.employees || []);
      setTotal(response.total);
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to fetch employees';
      setError(message);
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployee = useCallback(async (id: string): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const employee = await employeeApi.getById(id);
      setSelectedEmployee(employee); 
      return employee;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to fetch employee';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data: EmployeeCreate): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const employee = await employeeApi.create(data);
      setEmployees(prev => [employee, ...prev]);
      setTotal(prev => prev + 1);
      toast.success('Employee created successfully!');
      return employee;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to create employee';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, data: EmployeeUpdate): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const employee = await employeeApi.update(id, data);
      setEmployees(prev => prev.map(emp => emp.employee_id === id ? employee : emp));
      
      // Also update selectedEmployee if it's the same one
      if (selectedEmployee?.employee_id === id) {
        setSelectedEmployee(employee);
      }
      
      toast.success('Employee updated successfully!');
      return employee;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to update employee';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  const deleteEmployee = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await employeeApi.delete(id);
      setEmployees(prev => prev.filter(emp => emp.employee_id !== id));
      setTotal(prev => prev - 1);
      
      // Clear selectedEmployee if it's the deleted one
      if (selectedEmployee?.employee_id === id) {
        setSelectedEmployee(null);
      }
      
      toast.success('Employee deleted successfully!');
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to delete employee';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  const clearSelectedEmployee = useCallback(() => {
    setSelectedEmployee(null);
  }, []);

  // Load employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    selectedEmployee, 
    total,
    loading,
    error,
    fetchEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    clearSelectedEmployee,
  };
};