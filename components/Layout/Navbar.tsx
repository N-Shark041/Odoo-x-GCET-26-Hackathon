
import React from 'react';
import { User } from '../../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLogout, 
  darkMode, 
  onToggleDarkMode, 
  onToggleMobileMenu 
}) => {
  return (
    <nav className="h-16 min-h-[64px] w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 md:px-8 flex justify-between items-center z-40 transition-theme sticky top-0 flex-shrink-0">
      {/* Left Section: Mobile Toggle & Context */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
          aria-label="Toggle Menu"
        >
          <i className="fa-solid fa-bars-staggered text-xl"></i>
        </button>
        
        {/* Logo for mobile only */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-droplet text-white text-sm"></i>
          </div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Dayflow</h1>
        </div>

        {/* Desktop Breadcrumb/Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="h-8 w-[2px] bg-slate-100 dark:bg-slate-800 rounded-full mr-2"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Environment:</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Stable</span>
          </span>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - Visible on Desktop */}
        <div className="hidden md:flex relative group mr-2">
           <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
           <input 
            type="text" 
            placeholder="Quick search..."
            className="h-9 w-48 lg:w-64 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
           />
        </div>

        <div className="flex items-center gap-1 border-r border-slate-100 dark:border-slate-800 pr-2 md:pr-4">
          <button 
            onClick={onToggleDarkMode}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
            title="Toggle Appearance"
          >
            {darkMode ? (
              <i className="fa-solid fa-sun text-amber-400 group-hover:rotate-45 transition-transform"></i>
            ) : (
              <i className="fa-solid fa-moon group-hover:-rotate-12 transition-transform"></i>
            )}
          </button>
          
          <button 
            className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
            title="Notifications"
          >
            <i className="fa-solid fa-bell text-lg"></i>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>
        </div>
        
        {/* User Identity */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{user.role}</p>
          </div>
          <div className="relative">
            <img 
              src={user.profilePic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.employeeId} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <button 
            onClick={onLogout}
            className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Security Sign Out"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
