import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AttackSimulator } from './pages/AttackSimulator';
import { Transactions } from './pages/Transactions';
import { TransactionDetail } from './pages/TransactionDetail';
import { DecisionReplay } from './pages/DecisionReplay';
import { BenchmarkLab } from './pages/BenchmarkLab';
import { MlModelLab } from './pages/MlModelLab';
import { PolicyStudio } from './pages/PolicyStudio';
import { Alerts } from './pages/Alerts';
import { AlertDetail } from './pages/AlertDetail';
import { Intelligence } from './pages/Intelligence';
import { Operations } from './pages/Operations';
import { Rules } from './pages/Rules';
import { ApiPlayground } from './pages/ApiPlayground';
import { AuditLogs } from './pages/AuditLogs';
import {
  LayoutDashboard,
  Flame,
  CreditCard,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

/** Mobile bottom nav — 5 most-used links, hidden on lg+ */
const MobileBottomNav: React.FC = () => {
  const bottomItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Simulator', path: '/simulator', icon: Flame },
    { label: 'Ledger', path: '/transactions', icon: CreditCard },
    { label: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { label: 'Intelligence', path: '/intelligence', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg flex items-stretch h-16 safe-bottom">
      {bottomItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : ''}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

const ProtectedLayout: React.FC = () => {
  const { token, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-mono">
        Initializing FraudShield Enterprise Risk Engine...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        {/* pb-16 lg:pb-0 — clears space for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulator" element={<AttackSimulator />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/replay" element={<DecisionReplay />} />
            <Route path="/replay/:transactionId" element={<DecisionReplay />} />
            <Route path="/benchmark" element={<BenchmarkLab />} />
            <Route path="/ml-lab" element={<MlModelLab />} />
            <Route path="/policies" element={<PolicyStudio />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/alerts/:id" element={<AlertDetail />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/playground" element={<ApiPlayground />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;


