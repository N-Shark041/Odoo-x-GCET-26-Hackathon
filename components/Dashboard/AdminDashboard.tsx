
import React, { useState } from 'react';
import { User, AttendanceRecord, LeaveRequest, LeaveStatus } from '../../types';

interface AdminDashboardProps {
  users: User[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  onSelectUser: (user: User) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, attendance, leaves, onSelectUser, onApproveLeave, onRejectLeave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || u.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const stats = [
    { label: 'Workforce', value: users.length, icon: 'fa-users', color: 'text-blue-600', sub: 'Total staff' },
    { label: 'Present', value: attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: 'fa-calendar-check', color: 'text-green-600', sub: 'On duty' },
    { label: 'Pending', value: leaves.filter(l => l.status === LeaveStatus.PENDING).length, icon: 'fa-hourglass-half', color: 'text-amber-500', sub: 'Requests' },
    { label: 'Budget', value: `$${users.reduce((acc, u) => acc + (u.salaryBase || 0), 0).toLocaleString()}`, icon: 'fa-money-bill-wave', color: 'text-indigo-600', sub: 'Monthly' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Manage your enterprise workforce</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text"
              placeholder="Search..."
              className="h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#0078d4] text-sm w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="h-10 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-[#0078d4]"
          >
            <option value="All">All Departments</option>
            {Array.from(new Set(users.map(u => u.department))).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </header>

      {/* Fluent Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`text-xl ${item.color}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs font-medium text-gray-400 dark:text-slate-500">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white">Staff Roster</h3>
            <span className="text-xs font-semibold text-[#0078d4] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wider">{filteredUsers.length} Employees</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-50 dark:border-slate-700">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={u.profilePic} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{u.department}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onSelectUser(u)} className="text-[#0078d4] hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-all">
                        <i className="fa-solid fa-ellipsis-h"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-700">
            <h3 className="font-bold text-gray-900 dark:text-white">Approval Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {leaves.filter(l => l.status === LeaveStatus.PENDING).map(req => {
              const requester = users.find(u => u.id === req.userId);
              return (
                <div key={req.id} className="p-4 bg-[#faf9f8] dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3 mb-3">
                    <img src={requester?.profilePic} className="w-7 h-7 rounded-full" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{requester?.name}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 italic mb-4 px-1">"{req.remarks}"</p>
                  <div className="flex gap-2">
                    <button onClick={() => onRejectLeave(req.id)} className="flex-1 h-8 bg-white dark:bg-slate-800 border border-red-200 text-red-600 text-[11px] font-bold rounded hover:bg-red-50 transition-all">Reject</button>
                    <button onClick={() => onApproveLeave(req.id)} className="flex-1 h-8 bg-[#0078d4] text-white text-[11px] font-bold rounded hover:bg-[#106ebe] transition-all">Approve</button>
                  </div>
                </div>
              );
            })}
            {leaves.filter(l => l.status === LeaveStatus.PENDING).length === 0 && (
              <div className="text-center py-20 text-gray-400 italic text-sm">No pending requests</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
