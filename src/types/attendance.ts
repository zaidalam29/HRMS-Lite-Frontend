export type AttendanceStatus = 'Present' | 'Absent';

export interface Attendance {
  id: number;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string | null;
  employee_name?: string;
}

export interface AttendanceCreate {
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceUpdate {
  status?: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  employee_id: string;
  employee_name: string;
  total_present: number;
  total_absent: number;
  total_records: number;
}

export interface AttendanceFilters {
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  status?: AttendanceStatus;
}