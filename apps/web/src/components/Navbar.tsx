import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-[#101615]/95 backdrop-blur-md border-b border-[#26332E] px-6 flex items-center justify-between sticky top-0 z-10 font-sans">
      <div className="flex items-center space-x-3">
        <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
        <h2 className="text-xs font-semibold text-[#F1F5F2] uppercase tracking-wider">
          Analyst Operations Portal
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-1.5 text-[#9AA9A2] hover:text-[#F1F5F2] rounded-md hover:bg-[#151C1A] transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
        </button>

        <div className="h-4 w-px bg-[#26332E]"></div>

        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-md bg-[#10B981] text-[#0B0F0E] flex items-center justify-center text-xs font-extrabold shadow-sm">
            {user?.fullName?.substring(0, 2).toUpperCase() || 'AN'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-[#F1F5F2] leading-tight">{user?.fullName || 'Senior Analyst'}</p>
            <p className="text-[10px] text-[#34D399] font-mono tracking-wider">{user?.role || 'FRAUD_ANALYST'}</p>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-[#9AA9A2] hover:text-[#F87171] rounded-md hover:bg-[#151C1A] transition ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
