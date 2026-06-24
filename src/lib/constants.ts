// Payment / reconciliation statuses
export const PAYMENT_STATUS = {
  COMPLETE: 'complete',
  UNDERPAID: 'underpaid',
  OVERPAID: 'overpaid',
  PENDING: 'pending',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REVERSED: 'reversed',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// Virtual account statuses
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export type AccountStatus = typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];

// Misdirected payment statuses
export const MISDIRECTED_STATUS = {
  FLAGGED: 'flagged',
  RESOLVED: 'resolved',
  REFUNDED: 'refunded',
} as const;

export type MisdirectedStatus = typeof MISDIRECTED_STATUS[keyof typeof MISDIRECTED_STATUS];

// Refund reasons
export const REFUND_REASON = {
  OVERPAYMENT: 'overpayment',
  CANCELLED: 'cancelled',
  DUPLICATE: 'duplicate',
  ERROR: 'error',
  OTHER: 'other',
} as const;

export type RefundReason = typeof REFUND_REASON[keyof typeof REFUND_REASON];

// Refund statuses
export const REFUND_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed',
} as const;

export type RefundStatus = typeof REFUND_STATUS[keyof typeof REFUND_STATUS];

// Class levels (Nigerian school system)
export const CLASS_LEVELS = [
  'JSS1', 'JSS2', 'JSS3',
  'SSS1', 'SSS2', 'SSS3',
] as const;

export type ClassLevel = typeof CLASS_LEVELS[number];

// Current academic term
export const CURRENT_TERM = '2026-T1';

// Currency
export const CURRENCY = 'NGN';

// Naira formatter
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Nomba webhook events we care about
export const NOMBA_EVENTS = {
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REVERSAL: 'payment_reversal',
} as const;
