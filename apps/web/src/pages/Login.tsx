import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  KeyRound,
  ShieldAlert,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('analyst@fraudshield.io');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.success && res.data) {
      login(res.data.accessToken, res.data.refreshToken, res.data.user);
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-[#F1F5F2] flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Ambient Graphite/Emerald Background Glow */}
      <div className="brand-glow top-[-10%] left-[10%] w-[600px] h-[600px] bg-[#10B981]/10"></div>
      <div className="brand-glow bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#10B981]/5"></div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex items-center justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 w-full items-center">
          
          {/* LEFT COLUMN: Brand & Positioning */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-4">
            
            {/* Header Branding */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#10B981] text-[#0B0F0E] rounded-xl shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-2xl font-bold text-[#F1F5F2] tracking-tight">FraudShield</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/25 font-bold">
                    Enterprise Risk
                  </span>
                </div>
                <p className="text-xs text-[#9AA9A2] font-mono">
                  Real-time transaction risk decisioning & intelligence platform.
                </p>
              </div>
            </div>

            {/* Core Value Proposition */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F1F5F2] leading-tight">
                Autonomous risk decisioning <br className="hidden sm:block" />
                <span className="gradient-text">for high-velocity fintechs.</span>
              </h2>
              <p className="text-sm text-[#9AA9A2] leading-relaxed max-w-xl">
                Evaluate multi-signal rules, sliding-window Redis velocity limits, and real-time Python ML fraud probability in under 50ms.
              </p>
            </div>

            {/* Subtle Risk Decision Pipeline Card */}
            <div className="graphite-card p-5 border-[#26332E] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9AA9A2] font-mono border-b border-[#26332E] pb-3">
                <div className="flex items-center gap-2 text-[#F1F5F2] font-semibold">
                  <Activity className="w-4 h-4 text-[#34D399]" />
                  <span>Real-Time Risk Decision Pipeline</span>
                </div>
                <div className="text-[#34D399] font-bold flex items-center gap-1.5 bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
                  <span>SLA &lt; 42ms</span>
                </div>
              </div>

              {/* Sequential Flow Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg flex flex-col justify-center items-center">
                  <span className="text-[9px] text-[#6B7A72] uppercase tracking-wider block font-bold mb-1">01 &bull; Ingest</span>
                  <span className="text-xs font-semibold text-[#F1F5F2]">Idempotency</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg flex flex-col justify-center items-center">
                  <span className="text-[9px] text-[#6B7A72] uppercase tracking-wider block font-bold mb-1">02 &bull; Rules</span>
                  <span className="text-xs font-semibold text-[#34D399]">Risk Engine</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg flex flex-col justify-center items-center">
                  <span className="text-[9px] text-[#6B7A72] uppercase tracking-wider block font-bold mb-1">03 &bull; Velocity</span>
                  <span className="text-xs font-semibold text-[#F59E0B]">Redis Limits</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg flex flex-col justify-center items-center">
                  <span className="text-[9px] text-[#6B7A72] uppercase tracking-wider block font-bold mb-1">04 &bull; Inference</span>
                  <span className="text-xs font-semibold text-[#60A5FA]">Python ML</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#26332E] text-xs">
              <div className="flex items-center gap-2 text-[#F1F5F2] font-medium">
                <Zap className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span>Real-time decisions</span>
              </div>
              <div className="flex items-center gap-2 text-[#F1F5F2] font-medium">
                <ShieldAlert className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                <span>Explainable risk signals</span>
              </div>
              <div className="flex items-center gap-2 text-[#F1F5F2] font-medium">
                <Cpu className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
                <span>Analyst-ready workflows</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Centered Enterprise Login Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="graphite-card-elevated p-8 sm:p-10 w-full max-w-md space-y-6 border-[#26332E] shadow-2xl relative">
              
              {/* Card Header */}
              <div className="space-y-1.5 text-left">
                <h3 className="text-xl font-bold text-[#F1F5F2] tracking-tight">Welcome back</h3>
                <p className="text-xs text-[#9AA9A2]">
                  Sign in to access your FraudShield Analyst Operations Portal
                </p>
              </div>

              {/* Error Status Banner */}
              {error && (
                <div className="p-3.5 bg-[#F87171]/10 border border-[#F87171]/30 rounded-lg text-[#F87171] text-xs font-medium flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#F87171] flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7A72] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="analyst@fraudshield.io"
                      className="input-premium pl-10"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7A72] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="input-premium pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#6B7A72] hover:text-[#F1F5F2] transition focus:outline-none"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Emerald Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-2 py-3"
                >
                  <span>{loading ? 'Authenticating Session...' : 'Sign In to Portal'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Expandable Demo Credentials Drawer */}
              <div className="pt-4 border-t border-[#26332E]">
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="w-full flex items-center justify-between text-xs text-[#9AA9A2] hover:text-[#F1F5F2] transition py-1 focus:outline-none"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-[#34D399]">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Demo Credentials</span>
                  </span>
                  {showDemoCredentials ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDemoCredentials && (
                  <div className="mt-3 p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between py-1 border-b border-[#26332E]">
                      <div>
                        <p className="text-[#F1F5F2] font-semibold font-sans">Senior Fraud Analyst</p>
                        <p className="text-[10px] text-[#6B7A72]">analyst@fraudshield.io</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillCredentials('analyst@fraudshield.io', 'Password123!')}
                        className="px-2.5 py-1 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#34D399] rounded text-[10px] font-bold border border-[#10B981]/30 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Autofill</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-[#F1F5F2] font-semibold font-sans">System Administrator</p>
                        <p className="text-[10px] text-[#6B7A72]">admin@fraudshield.io</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillCredentials('admin@fraudshield.io', 'Password123!')}
                        className="px-2.5 py-1 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#34D399] rounded text-[10px] font-bold border border-[#10B981]/30 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Autofill</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Enterprise Footer */}
      <footer className="py-4 border-t border-[#26332E] text-center text-xs text-[#6B7A72] z-10 font-mono">
        FraudShield Risk Engine v1.0.0 &bull; Enterprise FinTech Intelligence
      </footer>
    </div>
  );
};
