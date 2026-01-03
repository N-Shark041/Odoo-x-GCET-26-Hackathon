
import React from 'react';
import { User, UserStatus } from '../../types';

interface DeactivateUserModalProps {
  user: User;
  onConfirm: (status: UserStatus) => void;
  onClose: () => void;
}

const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({ user, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            <i className="fa-solid fa-user-slash"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Change Account Status?</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            You are about to modify the access status for <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>. 
            Terminated employees lose immediate access to the Dayflow portal.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => onConfirm(UserStatus.TERMINATED)}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
            >
              Terminate Employee
            </button>
            <button 
              onClick={() => onConfirm(UserStatus.ON_LEAVE)}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
            >
              Set to On Leave
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            >
              Keep Active / Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateUserModal;
