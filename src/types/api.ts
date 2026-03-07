import { Employee } from './employee';
import { Attendance } from './attendance';

export interface ApiListResponse<T> {
  total: number;
  employees?: T[];
  records?: T[];
}

export interface ApiErrorResponse {
  message?: string;
  detail?: {
    message: string;
    error_code: string;
  };
  errors?: Record<string, string>;
  error_code?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export type EmployeeListResponse = ApiListResponse<Employee>;
export type AttendanceListResponse = ApiListResponse<Attendance>;