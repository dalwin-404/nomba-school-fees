import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { findById as findStudentById, update as updateStudent } from '@/lib/db/students';
import { findByAdminUserId } from '@/lib/db/schools';
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

    const serviceClient = createServiceClient();
    
    // Fetch related data
    const [accountRes, feesRes, transactionsRes, reconciliationRes] = await Promise.all([
      serviceClient.from('virtual_accounts').select('*').eq('student_id', id).single(),
      serviceClient.from('fees').select('*').eq('student_id', id),
      serviceClient.from('transactions').select('*').eq('student_id', id).order('received_at', { ascending: false }),
      serviceClient.from('reconciliation_log').select('*').eq('student_id', id).order('logged_at', { ascending: false }),
    ]);

    return NextResponse.json({
      student,
      virtual_account: accountRes.data,
      fees: feesRes.data || [],
      transactions: transactionsRes.data || [],
      reconciliation: reconciliationRes.data || [],
    });
  } catch (error: any) {
    logError('api:students:id:get', 'Error fetching student details', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const updatedStudent = await updateStudent(id, {
      first_name: body.firstName,
      last_name: body.lastName,
      parent_email: body.parentEmail,
      parent_phone: body.parentPhone,
      class_level: body.classLevel,
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error: any) {
    logError('api:students:id:put', 'Error updating student', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
