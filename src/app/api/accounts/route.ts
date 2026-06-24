import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { findById as findStudentById } from '@/lib/db/students';
import { create as createAccount, findByStudentId } from '@/lib/db/virtual-accounts';
import { getNombaProvider } from '@/lib/nomba';
import { generateAccountRef } from '@/lib/nomba/nuban';
import { logInfo, logError } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    const { studentId } = await request.json();
    if (!studentId) return NextResponse.json({ error: 'studentId is required' }, { status: 400 });

    const student = await findStudentById(studentId);
    if (!student || student.school_id !== school.id) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if account already exists
    const existingAccount = await findByStudentId(studentId);
    if (existingAccount && existingAccount.status === 'active') {
      return NextResponse.json({ error: 'Active account already exists' }, { status: 400 });
    }

    const accountRef = generateAccountRef(student.id);
    const provider = getNombaProvider();
    
    const nombaRes = await provider.createVirtualAccount({
      accountRef,
      accountName: `${student.first_name} ${student.last_name}`,
    });

    if (nombaRes.code !== '00') {
      throw new Error(`Nomba API returned code ${nombaRes.code}`);
    }

    const accountData = nombaRes.data;

    let account;
    if (existingAccount) {
      // Update existing pending account
      const { update } = require('@/lib/db/virtual-accounts');
      account = await update(existingAccount.id, {
        nomba_account_ref: accountRef,
        nomba_account_holder_id: accountData.accountHolderId,
        account_number: accountData.bankAccountNumber,
        account_name: accountData.accountName,
        bank_name: accountData.bankName,
        bank_account_name: accountData.bankAccountName,
        status: 'active',
      });
    } else {
      // Create new account
      account = await createAccount({
        student_id: student.id,
        school_id: school.id,
        nomba_account_ref: accountRef,
        nomba_account_holder_id: accountData.accountHolderId,
        account_number: accountData.bankAccountNumber,
        account_name: accountData.accountName,
        bank_name: accountData.bankName,
        bank_account_name: accountData.bankAccountName,
        status: 'active',
      });
    }

    logInfo('api:accounts', 'Virtual account created successfully', { studentId });

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    logError('api:accounts', 'Error creating virtual account', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
