-- ============================================================
-- School Fees Tracker — Database Schema
-- Run this entire block in Supabase SQL Editor
-- RLS is DISABLED for hackathon speed (API-level auth only)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- SCHOOLS
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_user_id UUID NOT NULL,
  nomba_merchant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schools_admin ON schools(admin_user_id);

-- ============================================
-- STUDENTS
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  parent_email TEXT,
  parent_phone TEXT,
  class_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);

-- ============================================
-- EXPECTED FEES
-- ============================================
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount_expected DECIMAL(12,2) NOT NULL,
  term TEXT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term)
);

CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);

-- ============================================
-- VIRTUAL ACCOUNTS (One per student)
-- ============================================
CREATE TABLE IF NOT EXISTS virtual_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  nomba_account_ref TEXT NOT NULL UNIQUE,
  nomba_account_holder_id TEXT,
  account_number TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  bank_name TEXT DEFAULT 'Nombank MFB',
  bank_account_name TEXT,
  callback_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_va_student ON virtual_accounts(student_id);
CREATE INDEX IF NOT EXISTS idx_va_school ON virtual_accounts(school_id);
CREATE INDEX IF NOT EXISTS idx_va_account_number ON virtual_accounts(account_number);

-- ============================================
-- TRANSACTIONS (Inbound transfers)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  virtual_account_id UUID NOT NULL REFERENCES virtual_accounts(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  nomba_txn_ref TEXT NOT NULL UNIQUE,
  nomba_order_ref TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  sender_name TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'failed', 'reversed')),
  verified_at TIMESTAMPTZ,
  reconciled_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_txn_va ON transactions(virtual_account_id);
CREATE INDEX IF NOT EXISTS idx_txn_student ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_txn_nomba_ref ON transactions(nomba_txn_ref);

-- ============================================
-- RECONCILIATION LOG
-- ============================================
CREATE TABLE IF NOT EXISTS reconciliation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  virtual_account_id UUID NOT NULL REFERENCES virtual_accounts(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  amount_expected DECIMAL(12,2) NOT NULL,
  amount_received DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('complete', 'underpaid', 'overpaid', 'pending')),
  shortfall DECIMAL(12,2),
  credit DECIMAL(12,2),
  note TEXT,
  parent_notified_at TIMESTAMPTZ,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term)
);

CREATE INDEX IF NOT EXISTS idx_recon_student_term ON reconciliation_log(student_id, term);

-- ============================================
-- MISDIRECTED PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS misdirected_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  nomba_account_ref TEXT,
  nomba_txn_ref TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  sender_name TEXT,
  payment_method TEXT,
  raw_payload JSONB,
  status TEXT DEFAULT 'flagged' CHECK (status IN ('flagged', 'resolved', 'refunded')),
  admin_note TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFUNDS (Manual tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT CHECK (reason IN ('overpayment', 'cancelled', 'duplicate', 'error', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEBHOOK LOGS (Audit + debugging)
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  duplicate BOOLEAN DEFAULT FALSE,
  error TEXT,
  request_id TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wh_event ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_wh_processed ON webhook_logs(processed);
