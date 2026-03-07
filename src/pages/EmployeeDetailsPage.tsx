import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Mail, Briefcase, Hash } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance } from '../hooks/useAttendance';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AttendanceSummary } from '../components/attendance/AttendanceSummary';
import { format } from 'date-fns';

export const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    selectedEmployee,
    loading: employeeLoading,
    error: employeeError,
    getEmployee,
    deleteEmployee,
  } = useEmployees();

  const {
    records,
    summary,
    loading: attendanceLoading,
    fetchAttendanceByEmployee,  
    fetchSummary,
  } = useAttendance();

  useEffect(() => {
    if (id) {
      getEmployee(id);
    }
  }, [id, getEmployee]);

  useEffect(() => {
    if (id) {

      fetchAttendanceByEmployee({ employeeId: id });
      fetchSummary({ employeeId: id });
    }
  }, [id, fetchAttendanceByEmployee, fetchSummary]);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteEmployee(id);
      if (success) {
        navigate('/employees');
      }
    }
  };

  // Show loading state
  if (employeeLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state
  if (employeeError || !selectedEmployee) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={employeeError || 'Employee not found'}
          onRetry={() => id && getEmployee(id)}
        />
      </div>
    );
  }

  const recentAttendance = records.slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedEmployee.full_name}</h1>
            <p className="text-gray-500">Employee Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/employees?edit=${selectedEmployee.employee_id}`)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="btn-danger flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-2xl">
                {selectedEmployee.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedEmployee.full_name}</h2>
              <p className="text-gray-500 mt-1">{selectedEmployee.department}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Hash className="w-5 h-5" />
              <span className="font-medium">Employee ID:</span>
              <span className="text-gray-900">{selectedEmployee.employee_id}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email:</span>
              <a href={`mailto:${selectedEmployee.email}`} className="text-primary-600 hover:underline">
                {selectedEmployee.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Department:</span>
              <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                {selectedEmployee.department}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Joined:</span>
              <span>{format(new Date(selectedEmployee.created_at), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <AttendanceSummary
        summary={summary}
        loading={attendanceLoading}
        employeeName={selectedEmployee.full_name}
      />

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
          <button
            onClick={() => navigate(`/attendance?employee=${selectedEmployee.employee_id}`)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {attendanceLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="medium" />
          </div>
        ) : recentAttendance.length > 0 ? (
          <div className="space-y-3">
            {recentAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {record.status}
                  </span>
                  {record.notes && (
                    <span className="text-sm text-gray-500">Note: {record.notes}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No attendance records found</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee.full_name}? This action cannot be undone and will also delete all attendance records for this employee.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        type="danger"
      />
    </div>
  );
};