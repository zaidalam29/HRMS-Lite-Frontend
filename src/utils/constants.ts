export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
] as const;

export const ATTENDANCE_STATUS = ['Present', 'Absent'] as const;

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
      VITE_APP_NAME?: string;
    };
  }
}

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export const APP_NAME = (import.meta as any).env?.VITE_APP_NAME || 'HRMS Lite';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
};

// ... rest remains the same

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DUPLICATE_EMPLOYEE: 'An employee with this email or ID already exists.',
  DUPLICATE_ATTENDANCE: 'Attendance already marked for this date.',
};

export const SUCCESS_MESSAGES = {
  EMPLOYEE_CREATED: 'Employee created successfully!',
  EMPLOYEE_UPDATED: 'Employee updated successfully!',
  EMPLOYEE_DELETED: 'Employee deleted successfully!',
  ATTENDANCE_MARKED: 'Attendance marked successfully!',
  ATTENDANCE_UPDATED: 'Attendance updated successfully!',
  ATTENDANCE_DELETED: 'Attendance record deleted successfully!',
};