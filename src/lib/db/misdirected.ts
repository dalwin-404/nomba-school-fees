import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface MisdirectedPayment {
  id: string;
  school_id: string | null;
  nomba_account_ref: string | null;
  nomba_txn_ref: string | null;
  amount: number;
  currency: string;
  sender_name: string | null;
  payment_method: string | null;
  raw_payload: any;
  status: 'flagged' | 'resolved' | 'refunded';
  admin_note: string | null;
  received_at: string;
  resolved_at: string | null;
  created_at: string;
}

export interface MisdirectedPaymentCreate {
  school_id?: string;
  nomba_account_ref?: string;
  nomba_txn_ref?: string;
  amount: number;
  currency?: string;
  sender_name?: string;
  payment_method?: string;
  raw_payload: any;
  status?: MisdirectedPayment['status'];
}

export async function create(data: MisdirectedPaymentCreate): Promise<MisdirectedPayment> {
  const supabase = createServiceClient();
  const { data: record, error } = await supabase
    .from('misdirected_payments')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:misdirected', 'Error creating misdirected payment', { error, data });
    throw error;
  }
  return record;
}

export async function findBySchoolId(schoolId: string): Promise<MisdirectedPayment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('misdirected_payments')
    .select('*')
    .eq('school_id', schoolId)
    .order('received_at', { ascending: false });

  if (error) {
    logError('db:misdirected', 'Error finding by school_id', { error, schoolId });
    throw error;
  }
  return data;
}

export async function update(id: string, data: Partial<MisdirectedPayment>): Promise<MisdirectedPayment> {
  const supabase = createServiceClient();
  const { data: record, error } = await supabase
    .from('misdirected_payments')
    .update({
      ...data,
      resolved_at: data.status && data.status !== 'flagged' ? new Date().toISOString() : undefined,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logError('db:misdirected', 'Error updating misdirected payment', { error, id, data });
    throw error;
  }
  return record;
}
