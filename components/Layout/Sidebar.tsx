
import React from 'react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'My Day', icon: 'fa-sun' },
    { id: 'profile', label: 'Profile', icon: 'fa-user' },
    { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
    { id: 'leave', label: 'Leave', icon: 'fa-umbrella-beach' },
    { id: 'payroll', label: 'Financials', icon: 'fa-wallet' },
  ];

  return (
    <aside className="w-64 h-full flex flex-col overflow-hidden">
      <div className="pt-8 pb-4 px-6 flex items-center space-x-3 shrink-0">
        <div className="w-8 h-8 bg-[#0078d4] rounded flex items-center justify-center">
          <i className="fa-solid fa-check text-white text-sm"></i>
        </div>
        <span className="text-xl font-bold tracking-tight text-[#0078d4] dark:text-blue-400">OdooDo</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-0.5 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full relative flex items-center space-x-3 px-6 py-3 transition-all duration-200 group ${
              activeView === item.id 
              ? 'bg-[#eff6fc] dark:bg-blue-900/20 text-[#0078d4] dark:text-blue-300' 
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            {/* Active Indicator Bar */}
            {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0078d4] rounded-r-full" />
            )}
            <i className={`fa-solid ${item.icon} w-5 text-center text-lg`}></i>
            <span className={`text-[15px] font-medium tracking-wide ${activeView === item.id ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      {/* Bottom Profile Preview */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${role === UserRole.ADMIN ? 'bg-[#0078d4]' : 'bg-green-500'}`} />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{role}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
