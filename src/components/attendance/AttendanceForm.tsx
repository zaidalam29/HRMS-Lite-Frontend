import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { AttendanceCreate, Employee } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { employeeApi } from '../../api/employees';

const attendanceSchema = z.object({
  employee_id: z.string().min(1, 'Please select an employee'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['Present', 'Absent'] as const),
  notes: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  onSubmit: (data: AttendanceCreate) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<AttendanceCreate>;
  isLoading?: boolean;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: initialData || {
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Present',
      notes: '',
    },
  });

  const selectedEmployeeId = watch('employee_id');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await employeeApi.getAll({ limit: 100 });
        setEmployees(response.employees || []);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFormSubmit = async (data: AttendanceFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Employee Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Employee <span className="text-red-500">*</span>
        </label>
        {loadingEmployees ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="small" />
            <span className="text-sm text-gray-500">Loading employees...</span>
          </div>
        ) : (
          <select
            {...register('employee_id')}
            className={`input-field ${errors.employee_id ? 'border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">-- Select an employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name} ({emp.department})
              </option>
            ))}
          </select>
        )}
        {errors.employee_id && (
          <p className="error-text">{errors.employee_id.message}</p>
        )}
      </div>

      {/* Date Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('date')}
          max={format(new Date(), 'yyyy-MM-dd')}
          className={`input-field ${errors.date ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.date && (
          <p className="error-text">{errors.date.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Cannot select future dates
        </p>
      </div>

      {/* Status Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Present"
              {...register('status')}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">Present</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Absent"
              {...register('status')}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">Absent</span>
          </label>
        </div>
        {errors.status && (
          <p className="error-text">{errors.status.message}</p>
        )}
      </div>

      {/* Notes Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Any additional notes..."
          className={`input-field ${errors.notes ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.notes && (
          <p className="error-text">{errors.notes.message}</p>
        )}
      </div>

      {/* Selected Employee Summary */}
      {selectedEmployeeId && employees.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-800 mb-2">Selected Employee</h4>
          {employees
            .filter(emp => emp.employee_id === selectedEmployeeId)
            .map(emp => (
              <div key={emp.id} className="text-sm text-primary-700">
                <p><span className="font-medium">Name:</span> {emp.full_name}</p>
                <p><span className="font-medium">ID:</span> {emp.employee_id}</p>
                <p><span className="font-medium">Department:</span> {emp.department}</p>
              </div>
            ))}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary min-w-[120px] flex items-center justify-center"
          disabled={isLoading || loadingEmployees}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            'Mark Attendance'
          )}
        </button>
      </div>
    </form>
  );
};