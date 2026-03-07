import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Edit2, Trash2, Filter } from 'lucide-react';
import { Attendance } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AttendanceListProps {
  records: Attendance[];
  loading: boolean;
  onEdit: (record: Attendance) => void;
  onDelete: (id: number) => Promise<void>;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  records,
  loading,
  onEdit,
  onDelete,
}) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (id: number) => {
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

  if (records.length === 0) {
    return (
      <EmptyState
        title="No attendance records found"
        description="Mark attendance to see records here."
        icon={<Filter className="w-12 h-12 text-gray-400" />}
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.employee_name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{record.employee_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.status === 'Present' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Absent
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {record.notes || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(record.id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        type="danger"
      />
    </>
  );
};