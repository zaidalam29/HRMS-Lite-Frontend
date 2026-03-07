import apiClient from './client';
import { Employee, EmployeeCreate, EmployeeUpdate, ApiListResponse } from '../types';

export const employeeApi = {
  // Get all employees
  getAll: async (params?: { skip?: number; limit?: number; department?: string }) => {
    const response = await apiClient.get<ApiListResponse<Employee>>('/api/v1/employees/', { params });
    return response.data;
  },

  // Get employee by ID
  getById: async (id: string) => {
    const response = await apiClient.get<Employee>(`/api/v1/employees/${id}`);
    return response.data;
  },

  // Create employee
  create: async (data: EmployeeCreate) => {
    const response = await apiClient.post<Employee>('/api/v1/employees/', data);
    return response.data;
  },

  // Update employee
  update: async (id: string, data: EmployeeUpdate) => {
    const response = await apiClient.put<Employee>(`/api/v1/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  delete: async (id: string) => {
    await apiClient.delete(`/api/v1/employees/${id}`);
  }
};