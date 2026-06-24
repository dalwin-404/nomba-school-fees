import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { create as createStudent } from '@/lib/db/students';
import { create as createFee } from '@/lib/db/fees';
import { create as createAccount } from '@/lib/db/virtual-accounts';
import { getNombaProvider } from '@/lib/nomba';
import { generateAccountRef } from '@/lib/nomba/nuban';
import { CURRENT_TERM } from '@/lib/constants';
import { logInfo, logError } from '@/lib/logger';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    // Join students with virtual accounts and latest reconciliation
    const serviceClient = createServiceClient();
    const { data: students, error } = await serviceClient
      .from('students')
      .select(`
        *,
        virtual_accounts!left (id, account_number, status),
        reconciliation_log!left (status, amount_expected, amount_received, shortfall, credit)
      `)
      .eq('school_id', school.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ students });
  } catch (error: any) {
    logError('api:students:get', 'Error fetching students', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    const body = await request.json();
    const { firstName, lastName, parentEmail, parentPhone, classLevel, expectedFee, term = CURRENT_TERM } = body;

    if (!firstName || !lastName || !expectedFee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create Student
    const student = await createStudent({
      school_id: school.id,
      first_name: firstName,
      last_name: lastName,
      parent_email: parentEmail,
      parent_phone: parentPhone,
      class_level: classLevel,
    });

    // 2. Create Expected Fee
    await createFee({
      student_id: student.id,
      amount_expected: Number(expectedFee),
      term,
    });

    // 3. Attempt Virtual Account Creation
    const accountRef = generateAccountRef(student.id);
    let virtualAccountStatus: 'active' | 'pending' = 'pending';
    let accountData: any = null;

    try {
      const provider = getNombaProvider();
      const nombaRes = await provider.createVirtualAccount({
        accountRef,
        accountName: `${firstName} ${lastName}`,
      });

      if (nombaRes.code === '00' && nombaRes.data) {
        accountData = nombaRes.data;
        virtualAccountStatus = 'active';
      }
    } catch (nombaError) {
      logError('api:students:post', 'Nomba account creation failed, saving as pending', { error: String(nombaError) });
      // We gracefully degrade: save student, but mark account as pending
    }

    // 4. Save Virtual Account to DB
    await createAccount({
      student_id: student.id,
      school_id: school.id,
      nomba_account_ref: accountRef,
      nomba_account_holder_id: accountData?.accountHolderId,
      account_number: accountData?.bankAccountNumber || `pending_${Date.now()}`,
      account_name: accountData?.accountName || `${firstName} ${lastName}`,
      bank_name: accountData?.bankName || 'Nombank MFB',
      bank_account_name: accountData?.bankAccountName,
      status: virtualAccountStatus,
    });

    logInfo('api:students:post', 'Student created', { studentId: student.id, accountStatus: virtualAccountStatus });

    return NextResponse.json({
      success: true,
      student,
      accountStatus: virtualAccountStatus,
    });
  } catch (error: any) {
    logError('api:students:post', 'Error creating student', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
