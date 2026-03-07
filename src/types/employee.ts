export type Department = 
  | 'Engineering' 
  | 'Marketing' 
  | 'Sales' 
  | 'Human Resources' 
  | 'Finance' 
  | 'Operations';

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: Department;
  created_at: string;
  updated_at: string | null;
}

export interface EmployeeCreate {
  employee_id?: string;
  full_name: string;
  email: string;
  department: Department;
}

export interface EmployeeUpdate {
  full_name?: string;
  email?: string;
  department?: Department;
}

export interface EmployeeFilters {
  department?: Department;
  search?: string;
}