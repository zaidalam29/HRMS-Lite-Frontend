import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, MoreVertical, UserPlus } from 'lucide-react';
import { Employee } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => Promise<void>;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  onEdit,
  onDelete,
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Get started by adding your first employee."
        icon={<UserPlus className="w-12 h-12 text-gray-400" />}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="card hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {employee.full_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{employee.full_name}</h3>
                  <p className="text-sm text-gray-500">{employee.employee_id}</p>
                </div>
              </div>
              
              <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {employee.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Department:</span>{' '}
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                  {employee.department}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Link
                to={`/employees/${employee.employee_id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(employee)}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(employee.employee_id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone and will also delete all attendance records for this employee."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        type="danger"
      />
    </>
  );
};