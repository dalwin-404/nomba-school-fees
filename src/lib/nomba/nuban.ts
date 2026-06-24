import { createHash } from 'crypto';

/**
 * Generate a mock NUBAN (Nigerian Uniform Bank Account Number) for testing.
 * Format: 939XXXXXXX (10 digits total, 939 = Nombank MFB prefix)
 * The remaining 7 digits are derived deterministically from the accountRef
 * so the same student always gets the same mock NUBAN.
 */
export function generateMockNuban(accountRef: string): string {
  const hash = createHash('sha256').update(accountRef).digest('hex');
  // Extract digits from hash, take first 7
  const digits = hash.replace(/[^0-9]/g, '').slice(0, 7).padEnd(7, '0');
  return `939${digits}`;
}

/**
 * Validate a NUBAN format.
 * Checks: exactly 10 digits, starts with 939 (Nombank MFB).
 */
export function isValidNuban(number: string): boolean {
  return /^939\d{7}$/.test(number);
}

/**
 * Generate a unique account reference for a student.
 * Format: student_<uuid> — must be 16-64 characters for Nomba API.
 */
export function generateAccountRef(studentId: string): string {
  return `student_${studentId}`;
}
