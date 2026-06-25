import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface Transaction {
  id: string;
  virtual_account_id: string;
  school_id: string;
  student_id: string;
  nomba_txn_ref: string;
  nomba_order_ref: string | null;
  amount: number;
  currency: string;
  sender_name: string | null;
  payment_method: string | null;
  status: 'pending' | 'confirmed' | 'failed' | 'reversed';
  verified_at: string | null;
  reconciled_at: string | null;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  virtual_account_id: string;
  school_id: string;
  student_id: string;
  nomba_txn_ref: string;
  nomba_order_ref?: string;
  amount: number;
  currency?: string;
  sender_name?: string;
  payment_method?: string;
  status?: Transaction['status'];
  verified_at?: string;
}

export async function findByVirtualAccountId(virtualAccountId: string): Promise<Transaction[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('virtual_account_id', virtualAccountId)
    .order('received_at', { ascending: false });

  if (error) {
    logError('db:transactions', 'Error finding transactions by virtual_account_id', { error, virtualAccountId });
    throw error;
  }
  return data;
}

export async function findByStudentId(studentId: string): Promise<Transaction[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('student_id', studentId)
    .order('received_at', { ascending: false });

  if (error) {
    logError('db:transactions', 'Error finding transactions by student_id', { error, studentId });
    throw error;
  }
  return data;
}

export async function findBySchoolId(schoolId: string): Promise<Transaction[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      students!inner (first_name, last_name, class_level)
    `)
    .eq('school_id', schoolId)
    .order('received_at', { ascending: false });

  if (error) {
    logError('db:transactions', 'Error finding transactions by school_id', { error, schoolId });
    throw error;
  }
  return data;
}

export async function findByNombaTxnRef(ref: string): Promise<Transaction | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('nomba_txn_ref', ref)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:transactions', 'Error finding transaction by nomba_txn_ref', { error, ref });
    throw error;
  }
  return data;
}

export async function findById(id: string): Promise<any | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      students!inner (first_name, last_name, class_level),
      virtual_accounts!inner (account_number),
      schools!inner (name)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:transactions', 'Error finding transaction by id', { error, id });
    throw error;
  }
  return data;
}

export async function create(data: TransactionCreate): Promise<Transaction> {
  const supabase = createServiceClient();
  const { data: txn, error } = await supabase
    .from('transactions')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:transactions', 'Error creating transaction', { error, data });
    throw error;
  }
  return txn;
}

export async function sumConfirmedByVirtualAccountId(virtualAccountId: string): Promise<number> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('virtual_account_id', virtualAccountId)
    .eq('status', 'confirmed');

  if (error) {
    logError('db:transactions', 'Error summing transactions', { error, virtualAccountId });
    throw error;
  }
  
  return data.reduce((sum: number, txn: any) => sum + Number(txn.amount), 0);
}

export async function markReconciled(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('transactions')
    .update({ reconciled_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    logError('db:transactions', 'Error marking transaction as reconciled', { error, id });
  }
}
