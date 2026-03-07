import React from 'react';
import { Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { AttendanceSummary as AttendanceSummaryType } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AttendanceSummaryProps {
  summary: AttendanceSummaryType | null;
  loading: boolean;
  employeeName?: string;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  summary,
  loading,
  employeeName,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8 text-gray-500">
        No summary data available
      </div>
    );
  }

  const presentPercentage = summary.total_records > 0
    ? Math.round((summary.total_present / summary.total_records) * 100)
    : 0;

  const absentPercentage = summary.total_records > 0
    ? Math.round((summary.total_absent / summary.total_records) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Attendance Summary {employeeName && `- ${employeeName}`}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">Total Records</p>
              <p className="text-2xl font-bold text-primary-700">{summary.total_records}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Present</p>
              <p className="text-2xl font-bold text-green-700">{summary.total_present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-700">{summary.total_absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Attendance Percentage Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Attendance Rate</span>
          <span className="text-primary-600 font-semibold">{presentPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${presentPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Present: {summary.total_present}</span>
          <span>Absent: {summary.total_absent}</span>
        </div>
      </div>

      {/* Trend Indicator */}
      {summary.total_records > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {presentPercentage >= 75 ? 'Good attendance rate' : 
               presentPercentage >= 50 ? 'Average attendance rate' : 
               'Low attendance rate'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};