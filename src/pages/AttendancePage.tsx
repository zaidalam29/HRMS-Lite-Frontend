import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { AttendanceList } from '../components/attendance/AttendanceList';
import { AttendanceForm } from '../components/attendance/AttendanceForm';
import { AttendanceFilters, FilterValues } from '../components/attendance/AttendanceFilters';
import { AttendanceSummary } from '../components/attendance/AttendanceSummary';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { Attendance, AttendanceCreate } from '../types';
import { Modal } from '../components/common/Modal';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { format } from 'date-fns';

export const AttendancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(''); // Fix: Initialize as empty string
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const {
    records,
    total,
    loading,
    error,
    summary,
    fetchAttendance,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    fetchSummary,
  } = useAttendance();

  const { employees, loading: employeesLoading } = useEmployees();

  useEffect(() => {
    // Check URL for action=mark
    if (searchParams.get('action') === 'mark') {
      setShowForm(true);
      setSearchParams({});
    }
    
    // Check URL for employee filter
    const employeeParam = searchParams.get('employee');
    if (employeeParam) {
      setSelectedEmployeeId(employeeParam);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchAttendance(filters);
  }, [filters, fetchAttendance]);

  // Fix: Only fetch summary if employeeId is selected
  useEffect(() => {
    if (selectedEmployeeId && selectedEmployeeId.trim() !== '') {
      console.log('Fetching summary for employee:', selectedEmployeeId);
      fetchSummary({ 
        employeeId: selectedEmployeeId, 
        start_date: dateRange.start, 
        end_date: dateRange.end 
      });
    } else {
      // Clear summary if no employee selected
      // You might want to add a clearSummary function in useAttendance
    }
  }, [selectedEmployeeId, dateRange, fetchSummary]);

  const handleMarkAttendance = async (data: AttendanceCreate) => {
    const result = await markAttendance(data);
    if (result) {
      setShowForm(false);
      fetchAttendance(filters);
    }
  };

  const handleUpdateAttendance = async (data: AttendanceCreate) => {
    if (editingRecord) {
      const result = await updateAttendance(editingRecord.id, data);
      if (result) {
        setEditingRecord(null);
        fetchAttendance(filters);
      }
    }
  };

  const handleDeleteAttendance = async (id: number) => {
    const success = await deleteAttendance(id);
    if (success) {
      fetchAttendance(filters);
    }
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    // Convert records to CSV
    const csv = [
      ['Employee ID', 'Employee Name', 'Date', 'Status', 'Notes'],
      ...records.map(r => [
        r.employee_id,
        r.employee_name || '',
        r.date,
        r.status,
        r.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const employeeOptions = employees.map(emp => ({
    id: emp.employee_id,
    name: emp.full_name,
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track and manage employee attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchAttendance(filters)}
            className="btn-secondary flex items-center gap-2"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
            disabled={records.length === 0}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      {!employeesLoading && (
        <AttendanceFilters
          onFilter={handleApplyFilters}
          employees={employeeOptions}
        />
      )}

      {/* Employee Summary Selection */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          View Attendance Summary
        </label>
        <select
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="input-field md:w-96"
        >
          <option value="">-- Select an employee --</option>
          {employeeOptions.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.id})
            </option>
          ))}
        </select>

        {selectedEmployeeId && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Attendance Summary - Only show if employee selected */}
      {selectedEmployeeId ? (
        <AttendanceSummary
          summary={summary}
          loading={loading}
          employeeName={employees.find(e => e.employee_id === selectedEmployeeId)?.full_name}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <p>Select an employee to view attendance summary</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchAttendance(filters)}
          onDismiss={() => {}} 
        />
      )}

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance Records ({total} total)
          </h2>
        </div>
        <AttendanceList
          records={records}
          loading={loading}
          onEdit={setEditingRecord}
          onDelete={handleDeleteAttendance}
        />
      </div>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Mark Attendance"
      >
        <AttendanceForm
          onSubmit={handleMarkAttendance}
          onCancel={() => setShowForm(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Edit Attendance Record"
      >
        {editingRecord && (
          <AttendanceForm
            initialData={{
              employee_id: editingRecord.employee_id,
              date: editingRecord.date,
              status: editingRecord.status,
              notes: editingRecord.notes || '',
            }}
            onSubmit={handleUpdateAttendance}
            onCancel={() => setEditingRecord(null)}
            isLoading={loading}
          />
        )}
      </Modal>
    </div>
  );
};