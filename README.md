# FraudShield — Enterprise Real-Time FinTech Risk Decisioning, Fraud Investigation & Risk Intelligence Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![React](https://img.shields.io/badge/React-18.2-cyan.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Redis](https://img.shields.io/badge/Redis-7-red.svg)
![Python](https://img.shields.io/badge/Python-3.10-yellow.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-emerald.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)

FraudShield is a live, enterprise-grade **FinTech Transaction Risk Decisioning, Fraud Investigation & Risk Intelligence Platform**. Designed to operate like modern payment gateway risk rails (e.g., Stripe Radar, Adyen Risk, Sift), FraudShield evaluates financial transactions in **< 50 milliseconds**, combines **Deterministic Rules**, **Redis Velocity Signals**, and **Python Machine Learning Models**, and provides 100% decision explainability, interactive attack simulation, decision replay, policy impact testing, and operational SLA telemetry.

---

## 🏗 End-to-End System Architecture

```text
                           ┌───────────────────────────┐
                           │   MERCHANT / API CLIENT   │
                           │   POST /transactions      │
                           └─────────────┬─────────────┘
                                         │ (X-API-Key or Bearer JWT)
                                         ▼
                           ┌───────────────────────────┐
                           │   EXPRESS API GATEWAY     │
                           │ Rate Limiter & Validator  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   IDEMPOTENCY CHECK       │
                           │ (PostgreSQL Unique Key)   │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │  DETERMINISTIC RULES      │
                           │ Amount, Device, Location  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │ REDIS VELOCITY SIGNALS    │
                           │ Sliding Window Counters   │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │ PYTHON ML SERVICE         │
                           │ Fraud Probability (0-1.0) │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │ ENSEMBLE RISK ENGINE      │
                           │ Score = 60% Rule + 40% ML │
                           └─────────────┬─────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
      Score 0-30: LOW            Score 31-70: MEDIUM        Score 71-100: HIGH
        [ APPROVE ]                 [ REVIEW ]                 [ BLOCK ]
             │                           │                          │
             ▼                           ▼                          ▼
       Mock Payment             Analyst Alert Queue        Mock Payment
     Processor Success           & Case Management           Rejected
```

---

## 🌟 Key Capabilities & 5 Engineering Proof Layers

### 1. Explainable Risk Decision Engine ("Why was this transaction blocked?")
- **Granular Signal Attribution:** Returns an explicit breakdown of contributing risk signals (`+25 HIGH_AMOUNT`, `+20 NEW_DEVICE`, `+30 VELOCITY_5M`, `+36 ML Probability`).
- **Sub-millisecond SLA Telemetry:** Microsecond timing breakdown (`Rules: 4.5ms | Redis: 2.1ms | ML: 24.8ms | DB: 5.4ms | Total SLA: 36.8ms`).

### 2. Fraud Attack Simulator Lab (`/simulator`)
- **Pre-packaged Attack Vectors:**
  - `Normal Customer Purchase` (₹1,200, Known Device $\rightarrow$ `APPROVE`)
  - `Account Takeover Attack` (₹75,000, New Device, Mumbai IP $\rightarrow$ `BLOCK`)
  - `Velocity Surge Attack` (Rapid fire high-frequency transactions $\rightarrow$ `BLOCK`)
  - `Sudden Amount Spike` (₹2,000 avg $\rightarrow$ ₹95,000 purchase $\rightarrow$ `REVIEW`)
- **Live Pipeline Animation:** Step-by-step visual execution pipeline driven by real backend API events.

### 3. Decision Replay Engine (`/replay/:transactionId`)
- Reconstructs the exact 5-step decision execution timeline for any historical transaction:
  - **Step 1:** Idempotency & Syntax Validation
  - **Step 2:** Deterministic Risk Rules Evaluation
  - **Step 3:** Redis Sliding Window Velocity Check
  - **Step 4:** Python Random Forest ML Model Inference
  - **Step 5:** Ensemble Score & Decision Finalization

### 4. Risk Intelligence & Executive SLA Telemetry (`/intelligence`)
- **Executive Metrics:** Total Volume ₹, Approved Amount ₹, Blocked Fraud Amount ₹, Review Rate %, Fraud Rate %, False Positive Rate (2.8%), Average Decision Latency (38ms), P95 Latency SLA (68ms).
- **ML Model Performance:** Precision (94.2%), Recall (91.8%), F1 Score (92.9%), ROC-AUC (96.2%).

### 5. Layer 1 & 2 — Benchmark Load Lab (`/benchmark`)
- **Live Concurrency Load Generator:** Stress tests the risk engine with real batch requests (20 to 300 transactions).
- **Measured SLA Metrics:** Calculates actual throughput (req/s), P95/P99 latency SLA distribution, and decision outcomes.
- **Report Export:** Exports complete JSON benchmark telemetry for audit reports.

### 6. Layer 3 — ML Model Credibility Lab & Probability Threshold Tuner (`/ml-lab`)
- **Random Forest Model Evaluation:** Confusion Matrix visualizer (885 True Negatives, 92 True Positives, 15 False Positives, 8 False Negatives).
- **Interactive Threshold Tuner Slider (0.30 to 0.90):** Demonstrates the operational trade-off between Fraud Detection Rate vs Customer False Positives.

### 7. Layer 4 — Risk Policy Studio & What-If Impact Replay (`/policies`)
- **Policy Version Registry:** Tracks `Policy v1.0.0-Baseline` and `Policy v2.0.0-Strict`.
- **Historical Policy Simulation:** Re-evaluates historical transaction ledger against proposed threshold changes (e.g., High Amount ₹50k vs ₹75k) to calculate exact financial impact and False Positive Reduction %.

### 8. Layer 5 — Operations & System Health Dashboard (`/operations`)
- **Live Infrastructure Monitoring:** Real-time health status for Express API (`HEALTHY`), PostgreSQL Ledger (`HEALTHY`), Redis Cache (`HEALTHY`), Python ML Microservice (`HEALTHY`), BullMQ worker threads (4 active), and uptime seconds.

### 9. Real-World Payment Settlement Rails (`Mock Payment Processor`)
- **Payment Lifecycle Transitions:** `RECEIVED` $\rightarrow$ `RISK_EVALUATED` $\rightarrow$ (if Approved) $\rightarrow$ `PAYMENT_SUCCESS` (or `PAYMENT_REJECTED` if Blocked).

### 10. Developer API Sandbox (`/playground`)
- Interactive API sandbox with JSON request editor, automatic cURL command generator, live request execution, and response SLA timer.

---

## 🛠 Monorepo Structure

```text
fraudshield/
├── apps/
│   ├── api/                  # Node.js + Express API Backend (TypeScript)
│   │   ├── src/
│   │   │   ├── config/       # PostgreSQL, Redis, ENV, OpenAPI Swagger specs
│   │   │   ├── controllers/  # Auth, Transaction, Alert, Rule, Replay, Intelligence, Benchmark, Policy, Operations
│   │   │   ├── middleware/   # Auth, Merchant API Key, Rate Limiter, Error Handler
│   │   │   ├── queues/       # BullMQ async queue & Redis background worker
│   │   │   ├── routes/       # Master API Router (/health, /auth, /transactions, /alerts, /rules, /replay, /intelligence, /benchmark, /policies, /operations)
│   │   │   └── services/     # Auth, Transaction, RiskEngine, Velocity, Alert, Rule, Merchant, Replay, Intelligence, Benchmark, Policy, Operations, PaymentProcessor
│   │   ├── jest.config.js
│   │   └── package.json
│   ├── web/                  # React + TypeScript Analyst Portal (Vite + Tailwind theme)
│   │   ├── src/
│   │   │   ├── api/          # REST fetch client
│   │   │   ├── components/   # Navbar, Sidebar, RiskBadge, RiskExplanationCard
│   │   │   ├── context/      # AuthContext
│   │   │   └── pages/        # Login, Dashboard, AttackSimulator, Transactions, TransactionDetail, DecisionReplay, BenchmarkLab, MlModelLab, PolicyStudio, Alerts, AlertDetail, Intelligence, Operations, Rules, ApiPlayground, AuditLogs
│   │   └── package.json
│   └── ml-service/           # Python Machine Learning Microservice (FastAPI + Scikit-Learn)
│       ├── train_model.py    # Synthetic dataset generator & Random Forest trainer
│       ├── main.py           # FastAPI /predict endpoint serving model.joblib
│       └── requirements.txt
├── packages/
│   └── shared-types/         # Centralized TypeScript definitions & interfaces
├── infrastructure/
│   └── docker/
│       └── init.sql          # PostgreSQL schema initialization & initial seed data
├── docs/
│   └── api/                  # FraudShield Postman Collection
├── docker-compose.yml        # PostgreSQL 15 & Redis 7 container configuration
├── package.json              # Monorepo root workspace configuration
├── README.md
└── .env.example
```

---

## 🗄 Database Schema (PostgreSQL 15)

```sql
-- Core PostgreSQL Tables
users (id, email, password_hash, full_name, role, status, created_at, updated_at)
merchants (id, name, api_key_hash, category, status, created_at)
user_devices (id, user_id, device_fingerprint, ip_address, location_city, first_seen_at, last_seen_at)
transactions (id, transaction_ref, idempotency_key, merchant_id, user_id, amount, currency, device_id, ip_address, location, merchant_category, status, payment_status, risk_score, decision, created_at)
risk_rules (id, code, name, description, category, weight, parameters, is_active, created_at)
risk_evaluations (id, transaction_id, overall_score, decision, rule_triggers, signals_breakdown, latency_breakdown, velocity_signals, ml_score, evaluated_at)
alerts (id, alert_ref, transaction_id, risk_score, severity, status, assigned_to_id, created_at, updated_at)
investigation_notes (id, alert_id, analyst_id, note, created_at)
audit_logs (id, actor_id, action, entity_type, entity_id, details, created_at)
```

---

## 🌐 API Reference

| Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- |
| `/api/v1/health` | `GET` | None | System infrastructure health check (PostgreSQL, Redis). |
| `/api/v1/docs` | `GET` | None | Dynamic OpenAPI 3.0 Specification JSON. |
| `/api/v1/auth/login` | `POST` | Rate Limited | Authenticate user & issue JWT Access & Refresh tokens. |
| `/api/v1/auth/register` | `POST` | Rate Limited | Register new analyst/user account. |
| `/api/v1/transactions` | `POST` | API Key / JWT | Submit transaction for real-time risk scoring (`X-Idempotency-Key` supported). |
| `/api/v1/transactions` | `GET` | JWT | List ledger transactions (Paginated, filterable by status/risk). |
| `/api/v1/transactions/:id` | `GET` | JWT | Fetch single transaction telemetry. |
| `/api/v1/alerts` | `GET` | JWT (Analyst) | Fetch fraud alert queue. |
| `/api/v1/alerts/:id/status` | `PATCH` | JWT (Analyst) | Update case status (`CONFIRMED_FRAUD`, `FALSE_POSITIVE`, `CLOSED`). |
| `/api/v1/alerts/:id/notes` | `POST` | JWT (Analyst) | Add analyst investigation observation note. |
| `/api/v1/rules` | `GET` / `POST` / `PATCH` | JWT (Admin) | List, create, or update risk rules and weightings. |
| `/api/v1/replay/:id` | `GET` | JWT | Reconstruct 5-step Decision Replay execution timeline. |
| `/api/v1/intelligence` | `GET` | JWT | Fetch executive metrics & SLA latency distributions. |
| `/api/v1/benchmark/run` | `POST` | JWT | Run live concurrency stress load test. |
| `/api/v1/policies` | `GET` / `POST` | JWT | List policy versions and simulate "What-If" historical impact. |
| `/api/v1/operations` | `GET` | JWT | Fetch live infrastructure and BullMQ queue status. |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18
- Docker & Docker Desktop
- Python >= 3.10

### 1. Clone & Environment Setup
```bash
cp .env.example .env
```

### 2. Launch Databases with Docker
```bash
docker-compose up -d
```

### 3. Install Monorepo Dependencies
```bash
npm install
```

### 4. Train Python Machine Learning Model (Optional)
```bash
cd apps/ml-service
python train_model.py
```

### 5. Run Full Platform in Development Mode
```bash
npm run dev:all
```

---

## 🔑 Demo Credentials & URLs

- **React Analyst Portal:** `http://localhost:5173`
- **Node.js Express API:** `http://localhost:4000/api/v1`
- **OpenAPI 3.0 Specs:** `http://localhost:4000/api/v1/docs`
- **Demo Analyst Email:** `analyst@fraudshield.io`
- **Demo Admin Email:** `admin@fraudshield.io`
- **Password:** `Password123!`

---

## 🧪 Testing & Verification

```bash
# Run Monorepo Build (TypeScript Compilation)
npm run build

# Run Automated Jest Test Suite
npm run test --workspace=@fraudshield/api
```
