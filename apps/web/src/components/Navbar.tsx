import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Menu, ShieldAlert, AlertTriangle, CheckCircle2, X, ExternalLink, RefreshCw } from 'lucide-react';
import { fetchApi } from '../api/client';

interface NavbarProps {
  onMenuToggle: () => void;
}

interface Notification {
  id: string;
  alertRef: string;
  riskScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  amount?: number;
  transactionRef?: string;
  createdAt: string;
  read: boolean;
}

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    icon: ShieldAlert,
    label: 'CRITICAL',
  },
  HIGH: {
    color: 'text-red-500',
    bg: 'bg-red-500/8',
    border: 'border-red-500/25',
    dot: 'bg-red-500',
    icon: ShieldAlert,
    label: 'HIGH',
  },
  MEDIUM: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-600',
    icon: AlertTriangle,
    label: 'MEDIUM',
  },
  LOW: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
    icon: CheckCircle2,
    label: 'LOW',
  },
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Fetch alerts and convert to notifications ──
  const fetchNotifications = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetchApi('/alerts?limit=20');
      if (res.success && Array.isArray(res.data)) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const incoming: Notification[] = res.data.map((a: any) => ({
            id: a.id,
            alertRef: a.alertRef,
            riskScore: a.riskScore,
            severity: (a.severity as Notification['severity']) || 'HIGH',
            status: a.status,
            amount: a.amount,
            transactionRef: a.transactionRef,
            createdAt: a.createdAt,
            read: existingIds.has(a.id) ? (prev.find((n) => n.id === a.id)?.read ?? false) : false,
          }));

          // Show browser notification for new OPEN/HIGH alerts
          const newAlerts = incoming.filter(
            (n) => !existingIds.has(n.id) && (n.severity === 'CRITICAL' || n.severity === 'HIGH') && n.status === 'OPEN'
          );
          if (newAlerts.length > 0 && prevCountRef.current > 0) {
            newAlerts.forEach((a) => {
              if (Notification.permission === 'granted') {
                new Notification(`🚨 FraudShield Alert — ${a.severity}`, {
                  body: `${a.alertRef} | Risk Score: ${a.riskScore} | ₹${a.amount?.toLocaleString() || 'N/A'}`,
                  icon: '/favicon.svg',
                });
              }
            });
          }
          prevCountRef.current = incoming.length;
          return incoming;
        });
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // ── Initial load + 30-second polling ──
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Request browser notification permission ──
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ── Close panel on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleNotificationClick = (n: Notification) => {
    markRead(n.id);
    setOpen(false);
    navigate(`/alerts/${n.id}`);
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-sans shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition -ml-1"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:block w-2 h-2 rounded-full bg-emerald-500"></span>
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider hidden sm:block">
          Analyst Operations Portal
        </h2>
        <h2 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider sm:hidden">
          FraudShield
        </h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">

        {/* ── NOTIFICATION BELL ── */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => { setOpen((o) => !o); if (!open) fetchNotifications(true); }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition relative"
            aria-label="Notifications"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-slate-800' : ''}`} />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {unreadCount === 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
            )}
          </button>

          {/* ── NOTIFICATION PANEL ── */}
          {open && (
            <div className="absolute right-0 top-10 w-[340px] sm:w-[400px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-slate-800">Risk Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchNotifications(true)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="px-2 py-0.5 text-[10px] text-emerald-600 hover:bg-emerald-50 rounded font-semibold transition"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-[420px] divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 opacity-40" />
                    <p className="text-xs text-slate-500 font-mono">No active risk alerts</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const cfg = SEVERITY_CONFIG[n.severity] || SEVERITY_CONFIG.MEDIUM;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition group flex items-start gap-3 ${
                          !n.read ? 'bg-slate-50/80' : 'bg-white'
                        }`}
                      >
                        {/* Severity icon */}
                        <div className={`mt-0.5 p-1.5 rounded-lg ${cfg.bg} border ${cfg.border} shrink-0`}>
                          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-bold text-emerald-600 font-mono truncate group-hover:underline">
                              {n.alertRef}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                          </div>

                          {/* Risk score bar */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  n.riskScore >= 70 ? 'bg-red-500' : n.riskScore >= 40 ? 'bg-amber-600' : 'bg-emerald-600'
                                }`}
                                style={{ width: `${n.riskScore}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-bold font-mono ${cfg.color}`}>
                              {n.riskScore}/100
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                                {cfg.label}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-500 border border-slate-200">
                                {n.status.replace('_', ' ')}
                              </span>
                              {n.amount && (
                                <span className="text-[10px] text-slate-800 font-mono font-semibold">
                                  ₹{Number(n.amount).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {timeAgo(n.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Unread dot */}
                        {!n.read && (
                          <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-1.5 animate-pulse`} />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Panel Footer */}
              <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50">
                <button
                  onClick={() => { setOpen(false); navigate('/alerts'); }}
                  className="w-full text-xs text-center text-emerald-600 hover:text-slate-800 font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <span>View All Alerts in Investigation Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm shrink-0">
            {user?.fullName?.substring(0, 2).toUpperCase() || 'AN'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName || 'Senior Analyst'}</p>
            <p className="text-[10px] text-emerald-600 font-mono tracking-wider">{user?.role || 'FRAUD_ANALYST'}</p>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};


