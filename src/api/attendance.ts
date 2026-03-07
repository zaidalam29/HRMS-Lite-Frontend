import apiClient from './client';
import { 
  Attendance, 
  AttendanceCreate, 
  AttendanceUpdate, 
  AttendanceSummary,
  ApiListResponse 
} from '../types';

export const attendanceApi = {
  // Mark attendance
  mark: async (data: AttendanceCreate) => {
    const response = await apiClient.post<Attendance>('/api/v1/attendance/', data);
    return response.data;
  },

  // Get attendance records
  getAll: async (params?: {
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<ApiListResponse<Attendance>>('/api/v1/attendance/', { params });
    return response.data;
  },

  // Get employee attendance
  getByEmployee: async (employeeId: string, params?: { start_date?: string; end_date?: string }) => {
    if (!employeeId) {
      throw new Error('Employee ID is required');
    }
    const response = await apiClient.get<ApiListResponse<Attendance>>(
      `/api/v1/attendance/employee/${employeeId}`,
      { params }
    );
    return response.data;
  },

  // Get attendance by ID
  getById: async (id: number) => {
    const response = await apiClient.get<Attendance>(`/api/v1/attendance/${id}`);
    return response.data;
  },

  // Update attendance
  update: async (id: number, data: AttendanceUpdate) => {
    const response = await apiClient.put<Attendance>(`/api/v1/attendance/${id}`, data);
    return response.data;
  },

  // Delete attendance
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/attendance/${id}`);
  },

  // Get attendance summary - Add validation
  getSummary: async (employeeId: string, params?: { start_date?: string; end_date?: string }) => {
    if (!employeeId) {
      throw new Error('Employee ID is required for summary');
    }
    const response = await apiClient.get<AttendanceSummary>(
      `/api/v1/attendance/summary/employee/${employeeId}`,
      { params }
    );
    return response.data;
  }
};