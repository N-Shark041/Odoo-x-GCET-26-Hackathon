
import React from 'react';
import { User, AttendanceRecord, LeaveRequest, LeaveStatus } from '../../types';

interface EmployeeDashboardProps {
  user: User;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  onNavigate: (view: string) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, attendance, leaves, onNavigate }) => {
  const lastAttendance = attendance[attendance.length - 1];
  const pendingLeaves = leaves.filter(l => l.status === LeaveStatus.PENDING).length;

  const quickActions = [
    { label: 'Position', value: user.position, icon: 'fa-id-badge', color: 'text-blue-600', link: 'profile' },
    { label: 'Current Status', value: lastAttendance?.status || 'Off duty', icon: 'fa-user-clock', color: 'text-green-600', link: 'attendance' },
    { label: 'Time Off', value: pendingLeaves > 0 ? `${pendingLeaves} Pending` : 'Plan Leave', icon: 'fa-plane', color: 'text-purple-600', link: 'leave' },
    { label: 'Base Salary', value: `$${user.salaryBase.toLocaleString()}`, icon: 'fa-money-bill-wave', color: 'text-indigo-600', link: 'payroll' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Good day, {user.name.split(' ')[0]}</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mt-1">Here's what's happening today at OdooDo.</p>
        </div>
        <button 
          onClick={() => onNavigate('attendance')}
          className="h-10 px-6 bg-[#0078d4] text-white rounded-lg font-semibold text-sm shadow-md shadow-blue-500/20 hover:bg-[#106ebe] transition-all"
        >
          Punch In
        </button>
      </header>

      {/* Fluent Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group" 
            onClick={() => onNavigate(action.link)}
          >
            <div className={`mb-4 text-xl ${action.color}`}>
              <i className={`fa-solid ${action.icon}`}></i>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{action.label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{action.value}</p>
            <div className="mt-4 text-[11px] font-bold text-[#0078d4] opacity-0 group-hover:opacity-100 transition-opacity">
              View details <i className="fa-solid fa-chevron-right ml-1"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 h-[500px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {leaves.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <i className="fa-solid fa-list-ul text-4xl mb-3"></i>
                <p className="font-semibold text-sm">No recent activity logs</p>
              </div>
            )}
            {leaves.slice(0, 8).map(req => (
              <div key={req.id} className="p-4 bg-[#faf9f8] dark:bg-slate-900/50 rounded-xl border border-gray-50 dark:border-slate-800 flex items-center gap-4 hover:bg-[#f3f2f1] dark:hover:bg-slate-800 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${req.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{req.type} Leave Request</p>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{req.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{req.startDate} — {req.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulletins Section */}
        <div className="bg-[#0078d4] dark:bg-slate-900 rounded-xl p-8 flex flex-col h-[500px] shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
          <h3 className="text-lg font-bold text-white mb-8 relative z-10">Bulletins</h3>
          <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-2">System Alert</p>
              <p className="text-sm text-white font-medium leading-relaxed">Quarterly performance reviews are now live. Please submit yours by Friday.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-2">Company Notice</p>
              <p className="text-sm text-white font-medium leading-relaxed">Office closed next Monday for public holiday. Enjoy your time off!</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-all border border-white/20 rounded-lg relative z-10">
            View All Announcements
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
