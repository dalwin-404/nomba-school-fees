import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { findById as findStudentById } from '@/lib/db/students';
import { findByStudentId } from '@/lib/db/transactions';
import { logError } from '@/lib/logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    const student = await findStudentById(id);
    if (!student || student.school_id !== school.id) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const transactions = await findByStudentId(id);

    return NextResponse.json({ transactions });
  } catch (error: any) {
    logError('api:transactions:student', 'Error getting transactions', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
