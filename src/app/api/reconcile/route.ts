import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { reconcileAllStudents } from '@/lib/reconcile';
import { logInfo, logError } from '@/lib/logger';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const school = await findByAdminUserId(user.id);
    if (!school) return NextResponse.json({ error: 'No school found' }, { status: 403 });

    logInfo('api:reconcile', 'Triggered full reconciliation', { schoolId: school.id });
    
    await reconcileAllStudents(school.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logError('api:reconcile', 'Error triggering reconciliation', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
