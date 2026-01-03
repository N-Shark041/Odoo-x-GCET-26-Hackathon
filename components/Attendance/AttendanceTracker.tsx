
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../../types';

interface AttendanceTrackerProps {
  user: User;
  records: AttendanceRecord[];
  onUpdateAttendance: () => Promise<void>;
  isAdmin: boolean;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ user, records, onUpdateAttendance, isAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get YYYY-MM-DD for today
  const today = new Date().toISOString().split('T')[0];
  
  // Improved find logic: Check if the record's date starts with today's date string
  const todayRecord = records.find(r => r.date.startsWith(today));

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAttendance = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onUpdateAttendance();
    } catch (err) {
      console.error("Attendance toggle failed", err);
      alert("Failed to sync attendance. Please try again.");
    } finally {
      // Small delay for better UX feel
      setTimeout(() => setLoading(false), 500);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch(status) {
      case AttendanceStatus.PRESENT: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case AttendanceStatus.ABSENT: return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case AttendanceStatus.HALF_DAY: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      case AttendanceStatus.LEAVE: return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-slate-700/50';
    }
  };

  const isShiftComplete = todayRecord?.checkIn && todayRecord?.checkOut;
  const isCurrentlyWorking = todayRecord?.checkIn && !todayRecord?.checkOut;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h2>
        <p className="text-gray-500 dark:text-slate-400 font-medium">Log your workday and track your performance.</p>
      </header>

      {/* Hero Action Card - Microsoft To Do Aesthetic */}
      {!isAdmin && (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-inner transition-colors duration-500 ${isCurrentlyWorking ? 'bg-blue-50 text-blue-600 animate-pulse' : isShiftComplete ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
              <i className={`fa-solid ${isShiftComplete ? 'fa-circle-check' : isCurrentlyWorking ? 'fa-hourglass-start' : 'fa-clock'}`}></i>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
            <button 
              disabled={loading || !!isShiftComplete}
              onClick={handleToggleAttendance}
              className={`h-12 px-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 w-full md:w-auto shadow-sm ${
                isShiftComplete 
                ? 'bg-green-50 text-green-600 cursor-default' 
                : isCurrentlyWorking
                ? 'bg-slate-900 dark:bg-slate-950 text-white hover:opacity-90 active:scale-95'
                : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:scale-95 shadow-blue-500/20'
              } ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : isShiftComplete ? (
                <><span>Shift Finished</span><i className="fa-solid fa-check ml-2"></i></>
              ) : isCurrentlyWorking ? (
                <><span>Clock Out</span><i className="fa-solid fa-right-from-bracket ml-2"></i></>
              ) : (
                <><span>Clock In Now</span><i className="fa-solid fa-right-to-bracket ml-2"></i></>
              )}
            </button>
            {isCurrentlyWorking && (
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping mr-2"></span>
                Ongoing Session
              </span>
            )}
            {isShiftComplete && (
              <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                Excellent! Work logged.
              </span>
            )}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Logs</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{records.length} Entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-50 dark:border-slate-700">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic text-sm font-medium bg-gray-50/30">
                    No records found for your account.
                  </td>
                </tr>
              ) : (
                records.map(record => {
                  const cin = record.checkIn ? new Date(record.checkIn) : null;
                  const cout = record.checkOut ? new Date(record.checkOut) : null;
                  const diff = cin && cout ? ((cout.getTime() - cin.getTime()) / (1000 * 60 * 60)).toFixed(1) + 'h' : '--';
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-slate-200">
                        {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-slate-400">
                        {cin ? cin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-slate-400">
                        {cout ? cout.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-[#0078d4]">
                        {diff}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
