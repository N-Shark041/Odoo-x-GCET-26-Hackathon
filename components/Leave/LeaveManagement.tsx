
import React, { useState } from 'react';
import { User, LeaveRequest, LeaveType, LeaveStatus } from '../../types';

interface LeaveManagementProps {
  user: User;
  isAdmin: boolean;
  leaves: LeaveRequest[];
  users: User[];
  onSubmitLeave: (req: LeaveRequest) => void;
  onStatusChange: (id: string, status: LeaveStatus, comment: string) => void;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ user, isAdmin, leaves, users, onSubmitLeave, onStatusChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: LeaveType.PAID,
    startDate: '',
    endDate: '',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      remarks: formData.remarks,
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    onSubmitLeave(newReq);
    setShowForm(false);
    setFormData({ type: LeaveType.PAID, startDate: '', endDate: '', remarks: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h2>
          <p className="text-gray-500 dark:text-slate-400">Track and manage time off requests.</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel Request' : 'New Leave Request'}
          </button>
        )}
      </header>

      {showForm && !isAdmin && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 shadow-xl animate-in slide-in-from-top-4 duration-300 transition-theme">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Apply for Leave</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Leave Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                required
              >
                <option value={LeaveType.PAID}>Paid Leave</option>
                <option value={LeaveType.SICK}>Sick Leave</option>
                <option value={LeaveType.UNPAID}>Unpaid Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Start Date</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">End Date</label>
                <input 
                  type="date" 
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Remarks / Reason</label>
              <textarea 
                rows={3}
                value={formData.remarks}
                onChange={e => setFormData({...formData, remarks: e.target.value})}
                placeholder="Briefly explain the reason for your leave..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                required
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md active:scale-[0.98] transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {leaves.length === 0 && (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 transition-theme">
            <i className="fa-solid fa-folder-open text-4xl text-gray-200 dark:text-slate-700 mb-4 block"></i>
            <p className="text-gray-400 dark:text-slate-500 font-medium italic">No leave requests to display.</p>
          </div>
        )}
        {leaves.slice().reverse().map(leave => {
          const requester = users.find(u => u.id === leave.userId);
          return (
            <div key={leave.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row transition-theme">
              <div className={`w-2 shrink-0 ${leave.status === LeaveStatus.APPROVED ? 'bg-emerald-500' : leave.status === LeaveStatus.REJECTED ? 'bg-red-500' : 'bg-amber-500'}`}></div>
              <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <img src={requester?.profilePic} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-700" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 dark:text-slate-200">{isAdmin ? requester?.name : leave.type + ' Leave'}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                        leave.status === LeaveStatus.APPROVED ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 
                        leave.status === LeaveStatus.REJECTED ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                        'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      <i className="fa-solid fa-calendar-days mr-1"></i>
                      {leave.startDate} to {leave.endDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 bg-gray-50 dark:bg-slate-900/50 p-2 rounded italic border border-gray-100 dark:border-slate-700">
                      "{leave.remarks}"
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-3">
                  {isAdmin && leave.status === LeaveStatus.PENDING ? (
                    <div className="flex space-x-2 w-full md:w-auto">
                       <button 
                        onClick={() => onStatusChange(leave.id, LeaveStatus.REJECTED, "Not feasible at this time")}
                        className="flex-1 md:flex-none px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => onStatusChange(leave.id, LeaveStatus.APPROVED, "Approved by HR")}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Admin Feedback</p>
                       <p className="text-sm font-medium text-gray-700 dark:text-slate-300 italic">{leave.adminComment || 'No feedback yet'}</p>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-300 dark:text-slate-500 font-bold uppercase tracking-wider">Requested on {new Date(leave.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveManagement;
