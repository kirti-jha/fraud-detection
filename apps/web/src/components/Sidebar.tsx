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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
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

  return (
    <aside className="w-64 bg-[#101615] border-r border-[#26332E] flex flex-col h-screen sticky top-0 z-20 font-sans select-none">
      {/* Header Brand */}
      <div className="p-4 border-b border-[#26332E] flex items-center space-x-3">
        <div className="p-2 bg-[#10B981] text-[#0B0F0E] rounded-lg shadow-sm">
          <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-[#F1F5F2] tracking-tight">FraudShield</h1>
          <p className="text-[10px] text-[#34D399] font-mono tracking-wider uppercase font-semibold">Risk Intelligence</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#151C1A] text-[#34D399] border-l-2 border-[#10B981] font-semibold'
                    : 'text-[#9AA9A2] hover:text-[#F1F5F2] hover:bg-[#151C1A]/60'
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
      <div className="p-3 border-t border-[#26332E] bg-[#0B0F0E]/50">
        <div className="text-[11px] text-[#9AA9A2] flex items-center justify-between font-mono">
          <span>Decision SLA</span>
          <span className="flex items-center text-[#34D399] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse mr-1.5 inline-block"></span>
            38.4ms
          </span>
        </div>
      </div>
    </aside>
  );
};
