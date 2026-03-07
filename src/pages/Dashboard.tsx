import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, TrendingUp, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance } from '../hooks/useAttendance';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { employees, loading: employeesLoading } = useEmployees();
  const { records, loading: attendanceLoading, fetchAttendance } = useAttendance();
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, total: 0 });

  useEffect(() => {
    // Fetch today's attendance
    const today = format(new Date(), 'yyyy-MM-dd');
    fetchAttendance({ date: today });
  }, [fetchAttendance]);

  useEffect(() => {
    if (records.length > 0) {
      const present = records.filter(r => r.status === 'Present').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      setTodayStats({ present, absent, total: records.length });
    } else {
      setTodayStats({ present: 0, absent: 0, total: 0 });
    }
  }, [records]);

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'bg-blue-500',
      link: '/employees',
    },
    {
      title: 'Present Today',
      value: todayStats.present,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/attendance',
    },
    {
      title: 'Absent Today',
      value: todayStats.absent,
      icon: XCircle,
      color: 'bg-red-500',
      link: '/attendance',
    },
    {
      title: 'Attendance Rate',
      value: employees.length > 0 
        ? `${Math.round((todayStats.present / employees.length) * 100)}%` 
        : '0%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/attendance',
    },
  ];

  if (employeesLoading || attendanceLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/employees?action=add"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200">
                <UserPlus className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Employee</p>
                <p className="text-sm text-gray-500">Create a new employee record</p>
              </div>
            </Link>

            <Link
              to="/attendance?action=mark"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <CalendarCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mark Attendance</p>
                <p className="text-sm text-gray-500">Record today's attendance</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    {record.status === 'Present' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {record.employee_name || record.employee_id}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(record.date), 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
};