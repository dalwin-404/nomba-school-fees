import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface ReconciliationLog {
  id: string;
  student_id: string;
  virtual_account_id: string;
  term: string;
  amount_expected: number;
  amount_received: number;
  status: 'complete' | 'underpaid' | 'overpaid' | 'pending';
  shortfall: number | null;
  credit: number | null;
  note: string | null;
  parent_notified_at: string | null;
  logged_at: string;
  updated_at: string;
}

export interface ReconciliationUpsert {
  student_id: string;
  virtual_account_id: string;
  term: string;
  amount_expected: number;
  amount_received: number;
  status: ReconciliationLog['status'];
  shortfall?: number;
  credit?: number;
  note?: string;
}

export async function findByStudentAndTerm(studentId: string, term: string): Promise<ReconciliationLog | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reconciliation_log')
    .select('*')
    .eq('student_id', studentId)
    .eq('term', term)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:reconciliation', 'Error finding by student and term', { error, studentId, term });
    throw error;
  }
  return data;
}

export async function findByStudentId(studentId: string): Promise<ReconciliationLog[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reconciliation_log')
    .select('*')
    .eq('student_id', studentId)
    .order('logged_at', { ascending: false });

  if (error) {
    logError('db:reconciliation', 'Error finding by student_id', { error, studentId });
    throw error;
  }
  return data;
}

export async function upsert(data: ReconciliationUpsert): Promise<ReconciliationLog> {
  const supabase = createServiceClient();
  const { data: log, error } = await supabase
    .from('reconciliation_log')
    .upsert(
      {
        ...data,
        updated_at: new Date().toISOString(),
        logged_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,term' }
    )
    .select()
    .single();

  if (error) {
    logError('db:reconciliation', 'Error upserting reconciliation log', { error, data });
    throw error;
  }
  return log;
}

export async function findBySchoolId(schoolId: string): Promise<any[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reconciliation_log')
    .select(`
      *,
      students!inner (school_id, first_name, last_name, class_level),
      virtual_accounts!inner (account_number)
    `)
    .eq('students.school_id', schoolId);

  if (error) {
    logError('db:reconciliation', 'Error finding by school_id', { error, schoolId });
    throw error;
  }
  return data;
}
