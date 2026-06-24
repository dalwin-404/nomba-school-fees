import { findByStudentAndTerm as findFeeByStudentAndTerm } from './db/fees';
import { findByStudentId as findAccountByStudentId } from './db/virtual-accounts';
import { sumConfirmedByVirtualAccountId } from './db/transactions';
import { upsert, ReconciliationLog } from './db/reconciliation';
import { findBySchoolId as findStudentsBySchoolId } from './db/students';
import { CURRENT_TERM, PAYMENT_STATUS, PaymentStatus } from './constants';
import { logInfo, logError } from './logger';

export async function reconcileStudent(studentId: string, term: string = CURRENT_TERM): Promise<ReconciliationLog | null> {
  try {
    // 1. Get expected fee
    const fee = await findFeeByStudentAndTerm(studentId, term);
    if (!fee) {
      logInfo('reconcile', `No fee record found for student ${studentId} term ${term}`);
      return null;
    }

    const expected = Number(fee.amount_expected);

    // 2. Get virtual account
    const account = await findAccountByStudentId(studentId);
    if (!account) {
      logInfo('reconcile', `No virtual account found for student ${studentId}`);
      return null;
    }

    // 3. Get total confirmed transactions
    const received = await sumConfirmedByVirtualAccountId(account.id);

    // 4. Calculate status, shortfall, and credit
    let status: PaymentStatus = PAYMENT_STATUS.PENDING;
    let shortfall = 0;
    let credit = 0;

    if (received === 0) {
      status = PAYMENT_STATUS.PENDING;
      shortfall = expected;
    } else if (received === expected) {
      status = PAYMENT_STATUS.COMPLETE;
    } else if (received < expected) {
      status = PAYMENT_STATUS.UNDERPAID;
      shortfall = expected - received;
    } else if (received > expected) {
      status = PAYMENT_STATUS.OVERPAID;
      credit = received - expected;
    }

    // 5. Upsert reconciliation log
    const log = await upsert({
      student_id: studentId,
      virtual_account_id: account.id,
      term,
      amount_expected: expected,
      amount_received: received,
      status,
      shortfall: shortfall > 0 ? shortfall : undefined,
      credit: credit > 0 ? credit : undefined,
    });

    logInfo('reconcile', `Reconciled student ${studentId}`, { term, expected, received, status });
    return log;

  } catch (error) {
    logError('reconcile', `Failed to reconcile student ${studentId}`, { error });
    throw error;
  }
}

export async function reconcileAllStudents(schoolId: string, term: string = CURRENT_TERM): Promise<void> {
  try {
    const students = await findStudentsBySchoolId(schoolId);
    logInfo('reconcile', `Starting reconciliation for ${students.length} students in school ${schoolId}`);

    for (const student of students) {
      await reconcileStudent(student.id, term);
    }

    logInfo('reconcile', `Completed reconciliation for school ${schoolId}`);
  } catch (error) {
    logError('reconcile', `Failed to reconcile school ${schoolId}`, { error });
    throw error;
  }
}
