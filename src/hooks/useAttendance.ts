import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { attendanceApi } from '../api/attendance';
import { Attendance, AttendanceCreate, AttendanceUpdate, AttendanceSummary } from '../types';

interface UseAttendanceReturn {
  records: Attendance[];
  total: number;
  loading: boolean;
  error: string | null;
  summary: AttendanceSummary | null;
  fetchAttendance: (params?: {
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }) => Promise<void>;
  fetchAttendanceByEmployee: (params: { employeeId: string; start_date?: string; end_date?: string }) => Promise<void>;
  markAttendance: (data: AttendanceCreate) => Promise<Attendance | null>;
  updateAttendance: (id: number, data: AttendanceUpdate) => Promise<Attendance | null>;
  deleteAttendance: (id: number) => Promise<boolean>;
  fetchSummary: (params: { employeeId: string; start_date?: string; end_date?: string }) => Promise<void>;
  clearSummary: () => void; 
}

export const useAttendance = (): UseAttendanceReturn => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  const fetchAttendance = useCallback(async (params?: {
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceApi.getAll(params);
      setRecords(response.records || []);
      setTotal(response.total);
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to fetch attendance records';
      setError(message);
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttendanceByEmployee = useCallback(async ({ 
    employeeId, 
    start_date, 
    end_date 
  }: { 
    employeeId: string; 
    start_date?: string; 
    end_date?: string 
  }) => {
    // Guard against undefined employeeId
    if (!employeeId) {
      console.warn('fetchAttendanceByEmployee called with undefined employeeId');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceApi.getByEmployee(employeeId, { start_date, end_date });
      setRecords(response.records || []);
      setTotal(response.total);
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to fetch employee attendance';
      setError(message);
      console.error('Fetch employee attendance error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = useCallback(async (data: AttendanceCreate): Promise<Attendance | null> => {
    setLoading(true);
    setError(null);
    try {
      const record = await attendanceApi.mark(data);
      setRecords(prev => [record, ...prev]);
      setTotal(prev => prev + 1);
      toast.success('Attendance marked successfully!');
      return record;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to mark attendance';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(async (id: number, data: AttendanceUpdate): Promise<Attendance | null> => {
    setLoading(true);
    setError(null);
    try {
      const record = await attendanceApi.update(id, data);
      setRecords(prev => prev.map(r => r.id === id ? record : r));
      toast.success('Attendance updated successfully!');
      return record;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to update attendance';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAttendance = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await attendanceApi.delete(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      setTotal(prev => prev - 1);
      toast.success('Attendance record deleted successfully!');
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to delete attendance record';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async ({ 
    employeeId, 
    start_date, 
    end_date 
  }: { 
    employeeId: string; 
    start_date?: string; 
    end_date?: string 
  }) => {
    // Guard against undefined employeeId
    if (!employeeId) {
      console.warn('fetchSummary called with undefined employeeId');
      setSummary(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching summary for employee:', employeeId);
      const data = await attendanceApi.getSummary(employeeId, { start_date, end_date });
      setSummary(data);
    } catch (err: any) {
      const message = err.response?.data?.detail?.message || 'Failed to fetch attendance summary';
      setError(message);
      console.error('Fetch summary error:', err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSummary = useCallback(() => {
    setSummary(null);
  }, []);

  return {
    records,
    total,
    loading,
    error,
    summary,
    fetchAttendance,
    fetchAttendanceByEmployee,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    fetchSummary,
    clearSummary,
  };
};