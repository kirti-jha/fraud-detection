-- FraudShield PostgreSQL Schema Initialization

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'FRAUD_ANALYST', 'MERCHANT', 'USER')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BLOCKED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_key_hash VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER DEVICES TABLE
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    location_city VARCHAR(100),
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, device_fingerprint)
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE,
    merchant_id UUID REFERENCES merchants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    device_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    location VARCHAR(255),
    merchant_category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'PROCESSING', 'RISK_EVALUATED', 'APPROVED', 'REVIEW', 'BLOCKED')),
    payment_status VARCHAR(50) DEFAULT 'PAYMENT_PROCESSING' CHECK (payment_status IN ('PAYMENT_PROCESSING', 'PAYMENT_SUCCESS', 'PAYMENT_REJECTED', 'PAYMENT_HELD_FOR_REVIEW')),
    risk_score INT DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    decision VARCHAR(50) CHECK (decision IN ('APPROVE', 'REVIEW', 'BLOCK')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. RISK RULES TABLE
CREATE TABLE IF NOT EXISTS risk_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    weight INT NOT NULL DEFAULT 10,
    parameters JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RISK EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS risk_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    decision VARCHAR(50) NOT NULL,
    rule_triggers JSONB DEFAULT '[]'::jsonb,
    signals_breakdown JSONB DEFAULT '[]'::jsonb,
    latency_breakdown JSONB DEFAULT '{}'::jsonb,
    velocity_signals JSONB DEFAULT '{}'::jsonb,
    ml_score NUMERIC(5, 4) DEFAULT 0.0,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_ref VARCHAR(100) UNIQUE NOT NULL,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    risk_score INT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ASSIGNED', 'UNDER_REVIEW', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE', 'CLOSED')),
    assigned_to_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. INVESTIGATION NOTES TABLE
CREATE TABLE IF NOT EXISTS investigation_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    analyst_id UUID NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_assigned ON alerts(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_lookup ON user_devices(user_id, device_fingerprint);

-- SEED SEED DATA
-- Default Password for Admin & Analyst: Password123! (bcrypt hash: $2a$10$w8T0M4j6lK8G9G8v8y1q.eH4hX9u9X/y7E3Q9n8kG)
INSERT INTO users (id, email, password_hash, full_name, role, status)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@fraudshield.io', '$2a$10$E9s0oM9d5N5e8k9j.Qx2O.yX6gB9n8kG4hX9u9X/y7E3Q9n8kG', 'System Administrator', 'ADMIN', 'ACTIVE'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'analyst@fraudshield.io', '$2a$10$E9s0oM9d5N5e8k9j.Qx2O.yX6gB9n8kG4hX9u9X/y7E3Q9n8kG', 'Senior Fraud Analyst', 'FRAUD_ANALYST', 'ACTIVE'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'user123@example.com', '$2a$10$E9s0oM9d5N5e8k9j.Qx2O.yX6gB9n8kG4hX9u9X/y7E3Q9n8kG', 'Rahul Sharma', 'USER', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Seed Rules
INSERT INTO risk_rules (code, name, description, category, weight, parameters)
VALUES
    ('HIGH_AMOUNT', 'Unusually Large Transaction', 'Triggers when transaction amount exceeds ₹50,000 threshold', 'AMOUNT', 25, '{"threshold": 50000}'),
    ('NEW_DEVICE', 'Unrecognized Device Fingerprint', 'Triggers when transaction originates from a device not registered to user history', 'DEVICE', 20, '{}'),
    ('NEW_LOCATION', 'Unrecognized Location or IP', 'Triggers when city or IP subnet differs from user profile history', 'LOCATION', 15, '{}'),
    ('HIGH_VELOCITY_5M', 'High Velocity (5 Minutes)', 'Triggers when user makes > 5 transactions within 5 minutes', 'VELOCITY', 30, '{"windowSeconds": 300, "maxCount": 5}'),
    ('AMOUNT_SPIKE', 'Amount Spike vs User Avg', 'Triggers when current transaction exceeds 5x user average historical amount', 'BEHAVIOR', 20, '{"multiplier": 5}')
ON CONFLICT (code) DO NOTHING;
