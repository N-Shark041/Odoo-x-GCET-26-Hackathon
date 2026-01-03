
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { User, UserRole } from '../../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: string;
  onViewChange: (view: any) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  onLogout, 
  darkMode, 
  onToggleDarkMode, 
  activeView, 
  onViewChange, 
  children 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#f3f2f1] dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans">
      {/* Sidebar - Microsoft Fluent Style */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-800
      `}>
        <Sidebar 
          role={user.role} 
          activeView={activeView} 
          onViewChange={(v) => {
            onViewChange(v);
            setIsMobileMenuOpen(false);
          }} 
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar 
          user={user} 
          onLogout={onLogout} 
          darkMode={darkMode} 
          onToggleDarkMode={onToggleDarkMode}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
