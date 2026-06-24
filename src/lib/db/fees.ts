import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface Fee {
  id: string;
  student_id: string;
  amount_expected: number;
  term: string;
  currency: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function findByStudentId(studentId: string): Promise<Fee[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('fees')
    .select('*')
    .eq('student_id', studentId);

  if (error) {
    logError('db:fees', 'Error finding fees by student_id', { error, studentId });
    throw error;
  }
  return data;
}

export async function findByStudentAndTerm(studentId: string, term: string): Promise<Fee | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('fees')
    .select('*')
    .eq('student_id', studentId)
    .eq('term', term)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:fees', 'Error finding fee by student and term', { error, studentId, term });
    throw error;
  }
  return data;
}

export async function create(data: {
  student_id: string;
  amount_expected: number;
  term: string;
  due_date?: string;
}): Promise<Fee> {
  const supabase = createServiceClient();
  const { data: fee, error } = await supabase
    .from('fees')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:fees', 'Error creating fee', { error, data });
    throw error;
  }
  return fee;
}

export async function update(id: string, data: Partial<Fee>): Promise<Fee> {
  const supabase = createServiceClient();
  const { data: fee, error } = await supabase
    .from('fees')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logError('db:fees', 'Error updating fee', { error, id, data });
    throw error;
  }
  return fee;
}
