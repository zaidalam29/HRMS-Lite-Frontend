import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmployeeCreate, Department } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

const employeeSchema = z.object({
  employee_id: z.string().optional(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  department: z.enum([
    'Engineering', 'Marketing', 'Sales', 
    'Human Resources', 'Finance', 'Operations'
  ] as const),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Partial<EmployeeCreate>;
  onSubmit: (data: EmployeeCreate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      full_name: '',
      email: '',
      department: 'Engineering',
    },
  });

  const departments: Department[] = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
  ];

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error.response?.data?.detail?.error_code === 'DUPLICATE_EMPLOYEE') {
        if (error.response.data.detail.message.includes('email')) {
          setError('email', { 
            type: 'manual', 
            message: 'This email is already registered' 
          });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Employee ID Field (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employee ID <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          {...register('employee_id')}
          placeholder="EMP001 (Auto-generated if left empty)"
          className={`input-field ${errors.employee_id ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.employee_id && (
          <p className="error-text">{errors.employee_id.message}</p>
        )}
      </div>

      {/* Full Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('full_name')}
          placeholder="John Doe"
          className={`input-field ${errors.full_name ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="error-text">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          placeholder="john@example.com"
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="error-text">{errors.email.message}</p>
        )}
      </div>

      {/* Department Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          {...register('department')}
          className={`input-field ${errors.department ? 'border-red-500' : ''}`}
          disabled={isLoading}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="error-text">{errors.department.message}</p>
        )}
      </div>

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
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            'Save Employee'
          )}
        </button>
      </div>
    </form>
  );
};