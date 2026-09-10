import {
  MOCK_TRANSACTIONS,
  MOCK_ALERTS,
  MOCK_RULES,
  MOCK_INTELLIGENCE,
  MOCK_OPERATIONS,
  MOCK_POLICIES,
  MOCK_POLICY_IMPACT,
  MOCK_REPLAY,
  MOCK_BENCHMARK,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK ROUTER — returns demo data when backend is offline
// ─────────────────────────────────────────────────────────────────────────────
function mockRouter(
  endpoint: string,
  method: string,
  body: any
): { success: boolean; data?: any; meta?: any } | null {
  const m = method.toUpperCase();

  // Auth
  if (endpoint === '/auth/login' && m === 'POST') {
    const { email, password } = body || {};
    if (password !== 'Password123!') return { success: false, data: { error: 'Invalid credentials' } };
    const isAdmin = email?.includes('admin');
    const token = isAdmin ? 'demo_admin_token' : 'demo_analyst_token';
    const user = {
      id: isAdmin ? 'demo-admin-1' : 'demo-analyst-1',
      email: email || 'analyst@fraudshield.io',
      fullName: isAdmin ? 'System Administrator' : 'Senior Fraud Analyst',
      role: isAdmin ? 'ADMIN' : 'ANALYST',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { success: true, data: { token, refreshToken: 'demo_refresh', user } };
  }

  if (endpoint === '/auth/me') {
    return { success: true, data: { user: { id: 'demo-1', email: 'analyst@fraudshield.io', fullName: 'Senior Fraud Analyst', role: 'ANALYST', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } };
  }

  // Transactions
  if (endpoint.startsWith('/transactions') && m === 'GET') {
    const txnId = endpoint.split('/transactions/')[1]?.split('?')[0];
    if (txnId) {
      const txn = MOCK_TRANSACTIONS.find((t) => t.id === txnId);
      return txn ? { success: true, data: txn } : { success: false, data: { error: 'Transaction not found' } };
    }
    const limitMatch = endpoint.match(/limit=(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
    const statusMatch = endpoint.match(/status=(\w+)/);
    let txns = [...MOCK_TRANSACTIONS];
    if (statusMatch) {
      txns = txns.filter((t) => t.decision === statusMatch[1] || t.status === statusMatch[1]);
    }
    return { success: true, data: txns.slice(0, limit), meta: { total: txns.length } };
  }

  if (endpoint === '/transactions' && m === 'POST') {
    const newTxn = {
      id: `txn-sim-${Date.now()}`,
      transactionRef: `TXN_${Date.now()}_SIM`,
      idempotencyKey: body?.idempotencyKey || `IK_${Date.now()}`,
      merchantId: 'merch-1', userId: body?.userId || 'demo-user',
      amount: String(body?.amount || 1000), currency: body?.currency || 'INR',
      deviceId: body?.deviceId || 'DEV_DEMO', ipAddress: body?.ipAddress || '127.0.0.1',
      location: body?.location || 'Delhi', merchantCategory: body?.merchantCategory || 'ECOMMERCE',
      status: 'COMPLETED', paymentStatus: body?.amount > 50000 ? 'PAYMENT_REJECTED' : 'PAYMENT_SUCCESS',
      riskScore: body?.amount > 50000 ? Math.floor(70 + Math.random() * 25) : Math.floor(5 + Math.random() * 20),
      decision: body?.amount > 50000 ? 'BLOCK' : 'APPROVE',
      createdAt: new Date().toISOString(),
    };
    MOCK_TRANSACTIONS.unshift(newTxn as any);
    const evalResult = {
      overallScore: newTxn.riskScore, decision: newTxn.decision,
      signalsBreakdown: newTxn.riskScore > 50
        ? [{ code: 'HIGH_AMOUNT', weight: 25, reason: `Amount ₹${body?.amount?.toLocaleString()} exceeds threshold` }, { code: 'NEW_DEVICE', weight: 20, reason: 'Unrecognized device fingerprint' }]
        : [{ code: 'NORMAL_BEHAVIOR', weight: 0, reason: 'All checks passed — low risk profile' }],
      ruleTriggers: newTxn.riskScore > 50
        ? [{ ruleCode: 'HIGH_AMOUNT', ruleName: 'Unusually High Amount', weight: 25, reason: `₹${body?.amount?.toLocaleString()} > ₹50,000 threshold` }]
        : [],
      latencyBreakdown: { rulesMs: 4.5, redisMs: 2.1, mlMs: 24.8, dbMs: 5.4, totalMs: 36.8 },
      mlScore: Math.round(newTxn.riskScore * 0.4),
    };
    return { success: true, data: { transaction: newTxn, evaluation: evalResult } };
  }

  // Alerts
  if (endpoint.startsWith('/alerts') && m === 'GET') {
    const urlPart = endpoint.split('/alerts/')[1]?.split('?')[0];
    const isNotesOrStatus = urlPart && (urlPart.includes('/notes') || urlPart.includes('/status'));
    const alertId = !isNotesOrStatus && urlPart ? urlPart : null;
    if (alertId) {
      const alert = MOCK_ALERTS.find((a) => a.id === alertId);
      return alert ? { success: true, data: alert } : { success: false, data: { error: 'Alert not found' } };
    }
    const statusMatch = endpoint.match(/status=(\w+)/);
    let alerts = [...MOCK_ALERTS];
    if (statusMatch && statusMatch[1] !== 'ALL') {
      alerts = alerts.filter((a) => a.status === statusMatch[1]);
    }
    return { success: true, data: alerts, meta: { total: alerts.length } };
  }

  if (endpoint.includes('/alerts/') && endpoint.includes('/status') && m === 'PATCH') {
    return { success: true, data: { message: 'Alert status updated (demo mode)' } };
  }

  if (endpoint.includes('/alerts/') && endpoint.includes('/notes') && m === 'POST') {
    return { success: true, data: { message: 'Note added (demo mode)' } };
  }

  // Rules
  if (endpoint === '/rules' && m === 'GET') {
    return { success: true, data: MOCK_RULES };
  }

  // Intelligence
  if (endpoint === '/intelligence') {
    return { success: true, data: MOCK_INTELLIGENCE };
  }

  // Operations
  if (endpoint === '/operations') {
    return { success: true, data: MOCK_OPERATIONS };
  }

  // Policies
  if (endpoint === '/policies' && m === 'GET') {
    return { success: true, data: MOCK_POLICIES };
  }
  if (endpoint.includes('/policies/simulate') || (endpoint === '/policies' && m === 'POST')) {
    return { success: true, data: MOCK_POLICY_IMPACT };
  }

  // Replay
  if (endpoint.startsWith('/replay/')) {
    const txnId = endpoint.split('/replay/')[1];
    return { success: true, data: MOCK_REPLAY(txnId) };
  }

  // Benchmark
  if (endpoint.includes('/benchmark/run') && m === 'POST') {
    const { totalRequests = 100, concurrency = 10 } = body || {};
    return {
      success: true,
      data: {
        ...MOCK_BENCHMARK,
        totalRequests,
        concurrency,
        reqPerSec: +(totalRequests / (totalRequests / 28 + Math.random() * 2)).toFixed(1),
        approveCount: Math.floor(totalRequests * 0.65),
        reviewCount: Math.floor(totalRequests * 0.22),
        blockCount: Math.floor(totalRequests * 0.13),
      },
    };
  }

  // Health
  if (endpoint === '/health') {
    return { success: true, data: { status: 'DEMO_MODE', message: 'Running in offline demo mode' } };
  }

  return null; // no mock route matched
}

// ─────────────────────────────────────────────────────────────────────────────
// Main fetchApi — tries real backend first, falls back to mock on failure
// ─────────────────────────────────────────────────────────────────────────────
export const fetchApi = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; meta?: any }> => {
  const token = localStorage.getItem('fraudshield_token');
  const isDemoMode = !token || token.startsWith('demo_');

  // Parse body for mock router
  let parsedBody: any = null;
  if (options.body && typeof options.body === 'string') {
    try { parsedBody = JSON.parse(options.body); } catch { /* ignore */ }
  }

  // If demo token, go straight to mock (skip network call)
  if (isDemoMode) {
    const method = options.method || 'GET';
    const mockResult = mockRouter(endpoint, method, parsedBody);
    if (mockResult) {
      await new Promise((r) => setTimeout(r, 180 + Math.random() * 200)); // realistic latency
      return mockResult as any;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    const contentType = res.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        error: res.status === 404
          ? 'Backend API endpoint not found (404).'
          : text.substring(0, 100) || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    if (!res.ok) {
      return { success: false, error: data.error || data.message || `HTTP ${res.status}: ${res.statusText}` };
    }

    return data;
  } catch (_err: any) {
    // Backend unreachable — fall back to mock data
    const method = options.method || 'GET';
    const mockResult = mockRouter(endpoint, method, parsedBody);
    if (mockResult) {
      await new Promise((r) => setTimeout(r, 180 + Math.random() * 200));
      return mockResult as any;
    }
    return { success: false, error: 'Backend offline — no mock data available for this endpoint.' };
  }
};


