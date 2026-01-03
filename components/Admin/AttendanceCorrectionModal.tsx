
import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../../types';

interface AttendanceCorrectionModalProps {
  record: AttendanceRecord;
  onSave: (updated: AttendanceRecord) => void;
  onClose: () => void;
}

const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({ record, onSave, onClose }) => {
  const [data, setData] = useState<AttendanceRecord>({ ...record });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <header className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Correct Attendance</h3>
          <p className="text-xs text-gray-500">Date: {record.date}</p>
        </header>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:text-white text-sm"
              value={data.status}
              onChange={e => setData({...data, status: e.target.value as AttendanceStatus})}
            >
              {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Clock In</label>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-white dark:bg-slate-900 dark:text-white"
                value={data.checkIn ? data.checkIn.substring(0, 16) : ''}
                onChange={e => setData({...data, checkIn: e.target.value})}
              />
            </div>
             <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Clock Out</label>
              <input 
                type="datetime-local" 
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-white dark:bg-slate-900 dark:text-white"
                value={data.checkOut ? data.checkOut.substring(0, 16) : ''}
                onChange={e => setData({...data, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Correction Reason</label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-white dark:bg-slate-900 dark:text-white"
              placeholder="e.g. Employee forgot to punch out"
              value={data.correctionNote || ''}
              onChange={e => setData({...data, correctionNote: e.target.value})}
              rows={2}
            />
          </div>
        </div>
        <footer className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex space-x-3">
          <button 
            onClick={() => onSave(data)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
          >
            Apply Correction
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white dark:bg-slate-700 text-gray-500 dark:text-slate-300 border border-gray-200 dark:border-slate-600 rounded-xl font-bold"
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AttendanceCorrectionModal;
