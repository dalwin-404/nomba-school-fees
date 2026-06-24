import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface Student {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  parent_email: string | null;
  parent_phone: string | null;
  class_level: string | null;
  created_at: string;
  updated_at: string;
}

export async function findBySchoolId(schoolId: string): Promise<Student[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  if (error) {
    logError('db:students', 'Error finding students by school_id', { error, schoolId });
    throw error;
  }
  return data;
}

export async function findById(id: string): Promise<Student | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError('db:students', 'Error finding student by id', { error, id });
    throw error;
  }
  return data;
}

export async function create(data: {
  school_id: string;
  first_name: string;
  last_name: string;
  parent_email?: string;
  parent_phone?: string;
  class_level?: string;
}): Promise<Student> {
  const supabase = createServiceClient();
  const { data: student, error } = await supabase
    .from('students')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:students', 'Error creating student', { error, data });
    throw error;
  }
  return student;
}

export async function update(id: string, data: Partial<Student>): Promise<Student> {
  const supabase = createServiceClient();
  const { data: student, error } = await supabase
    .from('students')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logError('db:students', 'Error updating student', { error, id, data });
    throw error;
  }
  return student;
}

export async function remove(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    logError('db:students', 'Error deleting student', { error, id });
    throw error;
  }
}

export async function countBySchoolId(schoolId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  if (error) {
    logError('db:students', 'Error counting students by school_id', { error, schoolId });
    throw error;
  }
  return count || 0;
}
