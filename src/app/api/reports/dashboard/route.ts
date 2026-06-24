import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { countBySchoolId } from '@/lib/db/students';
import { findBySchoolId } from '@/lib/db/reconciliation';
import { logError } from '@/lib/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    const totalStudents = await countBySchoolId(school.id);
    const reconciliations = await findBySchoolId(school.id);

    let totalExpected = 0;
    let totalReceived = 0;
    let countComplete = 0;
    let countUnderpaid = 0;
    let countOverpaid = 0;
    let countPending = 0;

    const studentsMap = new Map();

    for (const rec of reconciliations) {
      totalExpected += Number(rec.amount_expected);
      totalReceived += Number(rec.amount_received);

      switch (rec.status) {
        case 'complete': countComplete++; break;
        case 'underpaid': countUnderpaid++; break;
        case 'overpaid': countOverpaid++; break;
        case 'pending': countPending++; break;
      }

      studentsMap.set(rec.student_id, {
        id: rec.student_id,
        name: `${rec.students.first_name} ${rec.students.last_name}`,
        classLevel: rec.students.class_level,
        accountNumber: rec.virtual_accounts.account_number,
        expected: rec.amount_expected,
        received: rec.amount_received,
        status: rec.status,
        shortfall: rec.shortfall,
        credit: rec.credit,
      });
    }

    return NextResponse.json({
      totalStudents,
      totalExpected,
      totalReceived,
      countComplete,
      countUnderpaid,
      countOverpaid,
      countPending,
      students: Array.from(studentsMap.values()),
    });
  } catch (error: any) {
    logError('api:reports:dashboard', 'Error generating dashboard stats', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
