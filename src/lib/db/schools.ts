import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface School {
  id: string;
  name: string;
  admin_user_id: string;
  nomba_merchant_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function findByAdminUserId(userId: string): Promise<School | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('admin_user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:schools', 'Error finding school by admin user', { error, userId });
    throw error;
  }
  return data;
}

export async function create(data: { name: string; admin_user_id: string }): Promise<School> {
  const supabase = createServiceClient();
  const { data: school, error } = await supabase
    .from('schools')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:schools', 'Error creating school', { error, data });
    throw error;
  }
  return school;
}

export async function update(id: string, data: Partial<School>): Promise<School> {
  const supabase = createServiceClient();
  const { data: school, error } = await supabase
    .from('schools')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logError('db:schools', 'Error updating school', { error, id, data });
    throw error;
  }
  return school;
}
