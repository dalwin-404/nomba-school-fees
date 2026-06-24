import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface VirtualAccount {
  id: string;
  student_id: string;
  school_id: string;
  nomba_account_ref: string;
  nomba_account_holder_id: string | null;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_account_name: string | null;
  callback_url: string | null;
  status: 'active' | 'closed' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface VirtualAccountCreate {
  student_id: string;
  school_id: string;
  nomba_account_ref: string;
  nomba_account_holder_id?: string;
  account_number: string;
  account_name: string;
  bank_name?: string;
  bank_account_name?: string;
  callback_url?: string;
  status?: VirtualAccount['status'];
}

export async function findByStudentId(studentId: string): Promise<VirtualAccount | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('virtual_accounts')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:virtual_accounts', 'Error finding virtual account by student_id', { error, studentId });
    throw error;
  }
  return data;
}

export async function findByAccountRef(accountRef: string): Promise<VirtualAccount | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('virtual_accounts')
    .select('*')
    .eq('nomba_account_ref', accountRef)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:virtual_accounts', 'Error finding virtual account by accountRef', { error, accountRef });
    throw error;
  }
  return data;
}

export async function findByAccountNumber(accountNumber: string): Promise<VirtualAccount | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('virtual_accounts')
    .select('*')
    .eq('account_number', accountNumber)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:virtual_accounts', 'Error finding virtual account by account_number', { error, accountNumber });
    throw error;
  }
  return data;
}

export async function findByNombaAccountRef(nombaAccountRef: string): Promise<VirtualAccount | null> {
  return findByAccountRef(nombaAccountRef);
}

export async function create(data: VirtualAccountCreate): Promise<VirtualAccount> {
  const supabase = createServiceClient();
  const { data: va, error } = await supabase
    .from('virtual_accounts')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:virtual_accounts', 'Error creating virtual account', { error, data });
    throw error;
  }
  return va;
}

export async function update(id: string, data: Partial<VirtualAccount>): Promise<VirtualAccount> {
  const supabase = createServiceClient();
  const { data: va, error } = await supabase
    .from('virtual_accounts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logError('db:virtual_accounts', 'Error updating virtual account', { error, id, data });
    throw error;
  }
  return va;
}

export async function findPendingByStudentId(studentId: string): Promise<VirtualAccount | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('virtual_accounts')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'pending')
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:virtual_accounts', 'Error finding pending virtual account', { error, studentId });
    throw error;
  }
  return data;
}
