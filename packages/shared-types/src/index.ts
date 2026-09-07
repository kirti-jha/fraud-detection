// User Domain
export type UserRole = 'ADMIN' | 'FRAUD_ANALYST' | 'MERCHANT' | 'USER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Transaction & Payment Domain
export type TransactionStatus = 
  | 'RECEIVED' 
  | 'PROCESSING' 
  | 'RISK_EVALUATED' 
  | 'APPROVED' 
  | 'REVIEW' 
  | 'BLOCKED';

export type MockPaymentStatus = 
  | 'PAYMENT_PROCESSING' 
  | 'PAYMENT_SUCCESS' 
  | 'PAYMENT_REJECTED' 
  | 'PAYMENT_HELD_FOR_REVIEW';

export type RiskDecision = 'APPROVE' | 'REVIEW' | 'BLOCK';

export interface ILatencyBreakdown {
  rulesMs: number;
  redisMs: number;
  mlMs: number;
  dbMs: number;
  totalMs: number;
}

export interface ISignalBreakdown {
  code: string;
  name: string;
  category: RuleCategory;
  weight: number;
  reason: string;
  type: 'RULE' | 'VELOCITY' | 'ML' | 'BEHAVIOR';
}

export interface ITransaction {
  id: string;
  transactionRef: string;
  idempotencyKey?: string;
  merchantId?: string;
  userId: string;
  amount: number;
  currency: string;
  deviceId: string;
  ipAddress: string;
  location?: string;
  merchantCategory?: string;
  status: TransactionStatus;
  paymentStatus?: MockPaymentStatus;
  riskScore: number;
  decision?: RiskDecision;
  createdAt: string;
}

export interface ICreateTransactionInput {
  userId: string;
  merchantId?: string;
  amount: number;
  currency?: string;
  deviceId: string;
  ipAddress: string;
  location?: string;
  merchantCategory?: string;
  idempotencyKey?: string;
}

// Risk & Rule Domain
export type RuleCategory = 'AMOUNT' | 'VELOCITY' | 'DEVICE' | 'LOCATION' | 'BEHAVIOR';

export interface IRiskRule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: RuleCategory;
  weight: number;
  parameters: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

export interface IRuleTrigger {
  ruleCode: string;
  ruleName: string;
  category: RuleCategory;
  weight: number;
  reason: string;
}

export interface IRiskEvaluation {
  id: string;
  transactionId: string;
  overallScore: number;
  decision: RiskDecision;
  ruleTriggers: IRuleTrigger[];
  signalsBreakdown: ISignalBreakdown[];
  latencyBreakdown: ILatencyBreakdown;
  velocitySignals: Record<string, any>;
  mlScore: number;
  evaluatedAt: string;
}

// Decision Replay & SLA
export interface IDecisionReplayStep {
  stepNumber: number;
  stepName: string;
  status: 'PASSED' | 'TRIGGERED' | 'FAILED' | 'COMPLETED';
  latencyMs: number;
  summary: string;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
}

export interface IDecisionReplay {
  transactionId: string;
  transactionRef: string;
  amount: number;
  overallScore: number;
  decision: RiskDecision;
  latencyBreakdown: ILatencyBreakdown;
  signals: ISignalBreakdown[];
  steps: IDecisionReplayStep[];
  evaluatedAt: string;
}

// Benchmark Load Lab Domain
export interface IBenchmarkReport {
  scenarioName: string;
  totalRequests: number;
  concurrency: number;
  reqPerSec: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  approveCount: number;
  reviewCount: number;
  blockCount: number;
  latencyBreakdown: ILatencyBreakdown;
  executedAt: string;
}

// Risk Policy Versioning & Impact Simulation
export interface IRiskPolicyVersion {
  id: string;
  version: string;
  name: string;
  description: string;
  rules: IRiskRule[];
  isActive: boolean;
  publishedBy: string;
  createdAt: string;
}

export interface IPolicyImpactResult {
  policyVersion: string;
  historicalTxnsTested: number;
  currentBlocks: number;
  newBlocks: number;
  netDifference: number;
  falsePositiveReductionPct: number;
}

// System Operations & Health Telemetry
export interface ISystemHealth {
  apiStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  postgresStatus: 'HEALTHY' | 'UNHEALTHY';
  redisStatus: 'HEALTHY' | 'UNAVAILABLE';
  mlStatus: 'HEALTHY' | 'UNAVAILABLE';
  queueDepth: number;
  activeWorkers: number;
  uptimeSeconds: number;
  avgDecisionLatencyMs: number;
  errorRatePct: number;
}

// Risk Intelligence Metrics
export interface IRiskIntelligenceMetrics {
  totalEvaluated: number;
  approvedCount: number;
  reviewCount: number;
  blockedCount: number;
  approvedAmount: number;
  blockedAmount: number;
  reviewRatePct: number;
  fraudRatePct: number;
  falsePositiveRatePct: number;
  avgDecisionLatencyMs: number;
  p95DecisionLatencyMs: number;
  topTriggeredRule: string;
  topRiskyLocation: string;
}

// Alert & Case Domain
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'UNDER_REVIEW' 
  | 'CONFIRMED_FRAUD' 
  | 'FALSE_POSITIVE' 
  | 'CLOSED';

export interface IAlert {
  id: string;
  alertRef: string;
  transactionId: string;
  transactionRef?: string;
  amount?: number;
  riskScore: number;
  severity: AlertSeverity;
  status: AlertStatus;
  assignedToId?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  transaction?: ITransaction;
  evaluation?: IRiskEvaluation;
  notes?: IInvestigationNote[];
}

export interface IInvestigationNote {
  id: string;
  alertId: string;
  analystId: string;
  analystName?: string;
  note: string;
  createdAt: string;
}

// Audit Domain
export interface IAuditLog {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

// Common API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
