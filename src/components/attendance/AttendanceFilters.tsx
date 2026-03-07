import React, { useState } from 'react';
import { format } from 'date-fns';
import { Filter, X, Calendar, User } from 'lucide-react';

interface AttendanceFiltersProps {
  onFilter: (filters: FilterValues) => void;
  employees: { id: string; name: string }[];
}

export interface FilterValues {
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  onFilter,
  employees,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const hasFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {hasFilters && (
            <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Employee Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Employee
            </label>
            <select
              value={filters.employee_id || ''}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={!filters.status}
                  onChange={() => handleFilterChange('status', '')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">All</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="Present"
                  checked={filters.status === 'Present'}
                  onChange={() => handleFilterChange('status', 'Present')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-green-600">Present</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="Absent"
                  checked={filters.status === 'Absent'}
                  onChange={() => handleFilterChange('status', 'Absent')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-red-600">Absent</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};