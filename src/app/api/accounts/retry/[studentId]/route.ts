import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { findById as findStudentById } from '@/lib/db/students';
import { findPendingByStudentId, update as updateAccount } from '@/lib/db/virtual-accounts';
import { getNombaProvider } from '@/lib/nomba';
import { logInfo, logError } from '@/lib/logger';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    const student = await findStudentById(studentId);
    if (!student || student.school_id !== school.id) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const pendingAccount = await findPendingByStudentId(studentId);
    if (!pendingAccount) {
      return NextResponse.json({ error: 'No pending account found' }, { status: 404 });
    }

    const provider = getNombaProvider();
    const nombaRes = await provider.createVirtualAccount({
      accountRef: pendingAccount.nomba_account_ref,
      accountName: `${student.first_name} ${student.last_name}`,
    });

    if (nombaRes.code !== '00') {
      throw new Error(`Nomba API returned code ${nombaRes.code}`);
    }

    const accountData = nombaRes.data;

    const account = await updateAccount(pendingAccount.id, {
      nomba_account_holder_id: accountData.accountHolderId,
      account_number: accountData.bankAccountNumber,
      account_name: accountData.accountName,
      bank_name: accountData.bankName,
      bank_account_name: accountData.bankAccountName,
      status: 'active',
    });

    logInfo('api:accounts:retry', 'Virtual account creation retried successfully', { studentId });

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    logError('api:accounts:retry', 'Error retrying virtual account creation', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
