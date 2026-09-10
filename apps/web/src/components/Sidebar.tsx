import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  ShieldAlert,
  Sliders,
  ScrollText,
  ShieldCheck,
  Flame,
  RotateCcw,
  BarChart3,
  Code,
  Cpu,
  Activity,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Attack Simulator', path: '/simulator', icon: Flame },
    { label: 'Transactions Ledger', path: '/transactions', icon: CreditCard },
    { label: 'Decision Replay', path: '/replay', icon: RotateCcw },
    { label: 'Benchmark Load Lab', path: '/benchmark', icon: Cpu },
    { label: 'ML Model Lab', path: '/ml-lab', icon: Cpu },
    { label: 'Risk Policy Studio', path: '/policies', icon: Sliders },
    { label: 'Fraud Alerts Queue', path: '/alerts', icon: ShieldAlert },
    { label: 'Risk Intelligence', path: '/intelligence', icon: BarChart3 },
    { label: 'System Operations', path: '/operations', icon: Activity },
    { label: 'API Playground', path: '/playground', icon: Code },
    { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full font-sans select-none">
      {/* Header Brand */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
              <h1 className="font-bold text-sm text-slate-800 tracking-tight">FraudShield</h1>
              <p className="text-[10px] text-emerald-600 font-mono tracking-wider uppercase font-semibold">Risk Intelligence</p>
          </div>
        </div>
        {/* Close button — visible only on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Metric */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Decision SLA</span>
          <span className="flex items-center text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block"></span>
            38.4ms
          </span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: always-visible sticky sidebar ── */}
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:z-20 lg:w-64 lg:shrink-0">
        {sidebarContent}
      </div>

      {/* ── Mobile: slide-over drawer with backdrop ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-40 h-full flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};


