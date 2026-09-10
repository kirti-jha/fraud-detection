// ─────────────────────────────────────────────────────────────────────────────
// FraudShield — Mock Data Store
// Used when backend is unavailable (DEMO MODE)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS = [
  {
    id: 'txn-001', transactionRef: 'TXN_1725458100_0001', idempotencyKey: 'IK_001',
    merchantId: 'merch-1', userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    amount: '1200.00', currency: 'INR', deviceId: 'DEV_REGULAR_001',
    ipAddress: '127.0.0.1', location: 'Delhi', merchantCategory: 'ECOMMERCE',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_SUCCESS',
    riskScore: 12, decision: 'APPROVE', createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'txn-002', transactionRef: 'TXN_1725458200_0002', idempotencyKey: 'IK_002',
    merchantId: 'merch-1', userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    amount: '75000.00', currency: 'INR', deviceId: 'DEV_ATO_9912',
    ipAddress: '103.44.12.99', location: 'Mumbai', merchantCategory: 'ELECTRONICS',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_REJECTED',
    riskScore: 88, decision: 'BLOCK', createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'txn-003', transactionRef: 'TXN_1725458300_0003', idempotencyKey: 'IK_003',
    merchantId: 'merch-2', userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    amount: '95000.00', currency: 'INR', deviceId: 'DEV_REGULAR_001',
    ipAddress: '127.0.0.1', location: 'Delhi', merchantCategory: 'JEWELRY',
    status: 'REVIEW', paymentStatus: 'PENDING',
    riskScore: 58, decision: 'REVIEW', createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'txn-004', transactionRef: 'TXN_1725458400_0004', idempotencyKey: 'IK_004',
    merchantId: 'merch-1', userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    amount: '2350.00', currency: 'INR', deviceId: 'DEV_REGULAR_001',
    ipAddress: '127.0.0.1', location: 'Delhi', merchantCategory: 'RETAIL',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_SUCCESS',
    riskScore: 8, decision: 'APPROVE', createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 'txn-005', transactionRef: 'TXN_1725458500_0005', idempotencyKey: 'IK_005',
    merchantId: 'merch-3', userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    amount: '15000.00', currency: 'INR', deviceId: 'DEV_VELOCITY_TEST',
    ipAddress: '192.168.1.50', location: 'Bangalore', merchantCategory: 'GAMING',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_REJECTED',
    riskScore: 74, decision: 'BLOCK', createdAt: new Date(Date.now() - 48 * 60000).toISOString(),
  },
  {
    id: 'txn-006', transactionRef: 'TXN_1725458600_0006', idempotencyKey: 'IK_006',
    merchantId: 'merch-2', userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    amount: '3800.00', currency: 'INR', deviceId: 'DEV_REGULAR_002',
    ipAddress: '10.0.0.5', location: 'Hyderabad', merchantCategory: 'ECOMMERCE',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_SUCCESS',
    riskScore: 22, decision: 'APPROVE', createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'txn-007', transactionRef: 'TXN_1725458700_0007', idempotencyKey: 'IK_007',
    merchantId: 'merch-1', userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    amount: '62000.00', currency: 'INR', deviceId: 'DEV_NEW_XYZ',
    ipAddress: '45.33.12.11', location: 'Chennai', merchantCategory: 'ELECTRONICS',
    status: 'REVIEW', paymentStatus: 'PENDING',
    riskScore: 65, decision: 'REVIEW', createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
  },
  {
    id: 'txn-008', transactionRef: 'TXN_1725458800_0008', idempotencyKey: 'IK_008',
    merchantId: 'merch-3', userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    amount: '890.00', currency: 'INR', deviceId: 'DEV_REGULAR_003',
    ipAddress: '127.0.0.1', location: 'Pune', merchantCategory: 'FOOD',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_SUCCESS',
    riskScore: 5, decision: 'APPROVE', createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'txn-009', transactionRef: 'TXN_1725458900_0009', idempotencyKey: 'IK_009',
    merchantId: 'merch-2', userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    amount: '120000.00', currency: 'INR', deviceId: 'DEV_SUSPICIOUS_001',
    ipAddress: '103.44.99.88', location: 'Mumbai', merchantCategory: 'JEWELRY',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_REJECTED',
    riskScore: 96, decision: 'BLOCK', createdAt: new Date(Date.now() - 105 * 60000).toISOString(),
  },
  {
    id: 'txn-010', transactionRef: 'TXN_1725459000_0010', idempotencyKey: 'IK_010',
    merchantId: 'merch-1', userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    amount: '4500.00', currency: 'INR', deviceId: 'DEV_REGULAR_001',
    ipAddress: '127.0.0.1', location: 'Delhi', merchantCategory: 'RETAIL',
    status: 'COMPLETED', paymentStatus: 'PAYMENT_SUCCESS',
    riskScore: 15, decision: 'APPROVE', createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

export const MOCK_ALERTS = [
  {
    id: 'alt-001', alertRef: 'ALT_1725458200_0001',
    transactionId: 'txn-002', transactionRef: 'TXN_1725458200_0002',
    amount: 75000, riskScore: 88, severity: 'HIGH', status: 'OPEN',
    assignedToId: null, assignedToName: null,
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    evaluation: {
      ruleTriggers: [
        { ruleCode: 'HIGH_AMOUNT', ruleName: 'Unusually High Amount', weight: 25, reason: 'Transaction ₹75,000 exceeds threshold of ₹50,000' },
        { ruleCode: 'NEW_DEVICE', ruleName: 'Unrecognized Device', weight: 20, reason: 'Device DEV_ATO_9912 never seen for this user' },
        { ruleCode: 'SUSPICIOUS_IP', ruleName: 'High-Risk IP Geolocation', weight: 18, reason: 'IP 103.44.12.99 flagged in threat database' },
      ],
    },
    transaction: {
      transactionRef: 'TXN_1725458200_0002', amount: '75000.00',
      userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', deviceId: 'DEV_ATO_9912',
    },
    notes: [
      { id: 'note-1', analystName: 'Senior Fraud Analyst', note: 'Escalated to L2 review — clear Account Takeover pattern. IP flagged in threat intel.', createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
    ],
  },
  {
    id: 'alt-002', alertRef: 'ALT_1725458300_0002',
    transactionId: 'txn-003', transactionRef: 'TXN_1725458300_0003',
    amount: 95000, riskScore: 58, severity: 'MEDIUM', status: 'UNDER_REVIEW',
    assignedToId: 'analyst-1', assignedToName: 'Senior Fraud Analyst',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    evaluation: {
      ruleTriggers: [
        { ruleCode: 'AMOUNT_SPIKE', ruleName: 'Sudden Amount Spike', weight: 30, reason: 'User avg ₹2,000 — sudden ₹95,000 purchase is 47x deviation' },
      ],
    },
    transaction: {
      transactionRef: 'TXN_1725458300_0003', amount: '95000.00',
      userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', deviceId: 'DEV_REGULAR_001',
    },
    notes: [],
  },
  {
    id: 'alt-003', alertRef: 'ALT_1725458700_0003',
    transactionId: 'txn-007', transactionRef: 'TXN_1725458700_0007',
    amount: 62000, riskScore: 65, severity: 'MEDIUM', status: 'ASSIGNED',
    assignedToId: 'analyst-1', assignedToName: 'Senior Fraud Analyst',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 70 * 60000).toISOString(),
    evaluation: { ruleTriggers: [] },
    transaction: {
      transactionRef: 'TXN_1725458700_0007', amount: '62000.00',
      userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', deviceId: 'DEV_NEW_XYZ',
    },
    notes: [],
  },
  {
    id: 'alt-004', alertRef: 'ALT_1725458900_0004',
    transactionId: 'txn-009', transactionRef: 'TXN_1725458900_0009',
    amount: 120000, riskScore: 96, severity: 'CRITICAL', status: 'CONFIRMED_FRAUD',
    assignedToId: 'analyst-1', assignedToName: 'Senior Fraud Analyst',
    createdAt: new Date(Date.now() - 105 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    evaluation: {
      ruleTriggers: [
        { ruleCode: 'HIGH_AMOUNT', ruleName: 'Unusually High Amount', weight: 25, reason: '₹1,20,000 far exceeds ₹50,000 threshold' },
        { ruleCode: 'NEW_DEVICE', ruleName: 'Unrecognized Device', weight: 20, reason: 'New device fingerprint detected' },
        { ruleCode: 'VELOCITY_5M', ruleName: 'High Velocity (5-min window)', weight: 30, reason: '6 transactions in 5 minutes from same user' },
      ],
    },
    transaction: {
      transactionRef: 'TXN_1725458900_0009', amount: '120000.00',
      userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', deviceId: 'DEV_SUSPICIOUS_001',
    },
    notes: [
      { id: 'note-2', analystName: 'Senior Fraud Analyst', note: 'Confirmed fraud — chargeback filed. Card blocked permanently.', createdAt: new Date(Date.now() - 95 * 60000).toISOString() },
    ],
  },
  {
    id: 'alt-005', alertRef: 'ALT_1725458500_0005',
    transactionId: 'txn-005', transactionRef: 'TXN_1725458500_0005',
    amount: 15000, riskScore: 74, severity: 'HIGH', status: 'FALSE_POSITIVE',
    assignedToId: 'analyst-1', assignedToName: 'Senior Fraud Analyst',
    createdAt: new Date(Date.now() - 48 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    evaluation: {
      ruleTriggers: [
        { ruleCode: 'VELOCITY_5M', ruleName: 'High Velocity (5-min window)', weight: 30, reason: 'Multiple gaming transactions in short window' },
      ],
    },
    transaction: {
      transactionRef: 'TXN_1725458500_0005', amount: '15000.00',
      userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', deviceId: 'DEV_VELOCITY_TEST',
    },
    notes: [
      { id: 'note-3', analystName: 'Senior Fraud Analyst', note: 'False positive — user confirmed gaming tournament purchases. Whitelist applied.', createdAt: new Date(Date.now() - 44 * 60000).toISOString() },
    ],
  },
];

export const MOCK_RULES = [
  { id: 'rule-1', code: 'HIGH_AMOUNT', name: 'Unusually High Transaction Amount', description: 'Triggers when transaction amount exceeds ₹50,000. High-value transactions statistically correlate with fraud and account takeover events.', category: 'AMOUNT', weight: 25, parameters: { threshold: 50000 }, isActive: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'rule-2', code: 'NEW_DEVICE', name: 'Unrecognized Device Fingerprint', description: 'Triggers when a transaction originates from a device fingerprint never previously associated with this user account. Strong ATO signal.', category: 'DEVICE', weight: 20, parameters: {}, isActive: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'rule-3', code: 'VELOCITY_5M', name: 'High Transaction Velocity (5-min Window)', description: 'Redis sliding window check — triggers when more than 3 transactions occur within any 5-minute window from the same user/device.', category: 'VELOCITY', weight: 30, parameters: { windowSeconds: 300, maxCount: 3 }, isActive: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'rule-4', code: 'AMOUNT_SPIKE', name: 'Sudden Amount Spike vs User History', description: 'Triggers when transaction amount is more than 10x the user\'s 30-day average transaction value. Behavioral anomaly signal.', category: 'BEHAVIORAL', weight: 30, parameters: { spikeMultiplier: 10 }, isActive: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'rule-5', code: 'SUSPICIOUS_IP', name: 'High-Risk IP Geolocation', description: 'Cross-references IP address against threat intelligence database. Datacenter IPs, Tor exit nodes, and known fraud IPs score high.', category: 'LOCATION', weight: 18, parameters: {}, isActive: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'rule-6', code: 'LOCATION_MISMATCH', name: 'Geographic Location Mismatch', description: 'Detects when transaction location differs significantly from user\'s historical geolocation pattern.', category: 'LOCATION', weight: 15, parameters: {}, isActive: false, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
];

export const MOCK_INTELLIGENCE = {
  totalEvaluated: 10,
  approvedAmount: 12740,
  blockedAmount: 210000,
  fraudRatePct: 3,
  reviewRatePct: 20,
  falsePositiveRatePct: 2.8,
  avgDecisionLatencyMs: 38,
  p95DecisionLatencyMs: 68,
};

export const MOCK_OPERATIONS = {
  apiStatus: 'HEALTHY',
  postgresStatus: 'HEALTHY',
  redisStatus: 'HEALTHY',
  mlStatus: 'HEALTHY',
  uptimeSeconds: 3600,
  queueDepth: 0,
  activeWorkers: 4,
  avgDecisionLatencyMs: 38.4,
  errorRatePct: 0.02,
};

export const MOCK_POLICIES = [
  { id: 'pol-1', version: 'v1.0.0', name: 'Baseline Risk Policy', description: 'Standard fraud detection thresholds. HIGH_AMOUNT=₹50k, NEW_DEVICE weight=20, VELOCITY window=5min. Production-stable since Q1 2026.', isActive: false, publishedBy: 'admin@fraudshield.io', createdAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: 'pol-2', version: 'v2.0.0', name: 'Strict Risk Policy (Festival Season)', description: 'Enhanced thresholds for high-risk periods. HIGH_AMOUNT=₹30k, NEW_DEVICE weight=30, VELOCITY window=3min. Reduces fraud by ~18% at cost of 3% additional false positives.', isActive: true, publishedBy: 'admin@fraudshield.io', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
];

export const MOCK_POLICY_IMPACT = {
  historicalTxnsTested: 10,
  currentBlocks: 3,
  newBlocks: 4,
  falsePositiveReductionPct: 12,
};

export const MOCK_REPLAY = (txnId: string) => {
  const txn = MOCK_TRANSACTIONS.find((t) => t.id === txnId) || MOCK_TRANSACTIONS[0];
  return {
    transactionRef: txn.transactionRef,
    overallScore: txn.riskScore,
    decision: txn.decision,
    evaluatedAt: txn.createdAt,
    signals: txn.riskScore > 50
      ? [{ code: 'HIGH_AMOUNT', weight: 25 }, { code: 'NEW_DEVICE', weight: 20 }]
      : [],
    latencyBreakdown: { rulesMs: 4.5, redisMs: 2.1, mlMs: 24.8, dbMs: 5.4, totalMs: 36.8 },
    steps: [
      { stepNumber: 1, stepName: 'Idempotency & Syntax Validation', status: 'PASSED', latencyMs: 1.2, summary: 'Request validated — unique idempotency key confirmed. No duplicate detected.', inputPayload: { idempotencyKey: txn.idempotencyKey, amount: txn.amount }, outputPayload: { isDuplicate: false, valid: true } },
      { stepNumber: 2, stepName: 'Deterministic Risk Rules Evaluation', status: txn.riskScore > 50 ? 'TRIGGERED' : 'PASSED', latencyMs: 4.5, summary: txn.riskScore > 50 ? 'HIGH_AMOUNT + NEW_DEVICE rules triggered, contributing +45 to risk score.' : 'No deterministic rules triggered.', inputPayload: { amount: txn.amount, deviceId: txn.deviceId }, outputPayload: { triggeredRules: txn.riskScore > 50 ? ['HIGH_AMOUNT', 'NEW_DEVICE'] : [], ruleScore: txn.riskScore > 50 ? 45 : 0 } },
      { stepNumber: 3, stepName: 'Redis Sliding Window Velocity Check', status: 'PASSED', latencyMs: 2.1, summary: 'Transaction count within 5-minute window: 1. Below threshold of 3.', inputPayload: { userId: txn.userId, windowSeconds: 300 }, outputPayload: { count5m: 1, count1h: 3, velocityRisk: false } },
      { stepNumber: 4, stepName: 'Python ML Random Forest Inference', status: 'PASSED', latencyMs: 24.8, summary: `ML fraud probability: ${(txn.riskScore / 100 * 0.9).toFixed(2)}. Weighted contribution to ensemble score: ${Math.round(txn.riskScore * 0.4)} points.`, inputPayload: { amount: txn.amount, isNewDevice: txn.riskScore > 50, velocityCount: 1 }, outputPayload: { fraudProbability: (txn.riskScore / 100 * 0.9).toFixed(2), mlScore: Math.round(txn.riskScore * 0.4) } },
      { stepNumber: 5, stepName: 'Ensemble Score & Decision Finalization', status: 'PASSED', latencyMs: 5.4, summary: `Final ensemble score: ${txn.riskScore}/100. Decision: ${txn.decision}. Payment status: ${txn.paymentStatus}.`, inputPayload: { ruleScore: Math.round(txn.riskScore * 0.6), mlScore: Math.round(txn.riskScore * 0.4) }, outputPayload: { finalScore: txn.riskScore, decision: txn.decision, paymentStatus: txn.paymentStatus } },
    ],
  };
};

export const MOCK_BENCHMARK: any = {
  totalRequests: 100, concurrency: 10,
  reqPerSec: 28.4, avgLatencyMs: 38.2, p95LatencyMs: 68.5, p99LatencyMs: 94.1,
  approveCount: 65, reviewCount: 22, blockCount: 13,
  latencyBreakdown: { rulesMs: 4.5, redisMs: 2.1, mlMs: 24.8, dbMs: 5.4 },
};

