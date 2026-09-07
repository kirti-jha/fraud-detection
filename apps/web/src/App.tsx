import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedLayout: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Initializing FraudShield Enterprise Risk Engine...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
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
