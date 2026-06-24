import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { create as createSchool } from '@/lib/db/schools';
import { logInfo, logError } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { email, password, schoolName } = await request.json();

    if (!email || !password || !schoolName) {
      return NextResponse.json(
        { error: 'Email, password, and school name are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Create user using admin API (bypasses email confirmation for hackathon)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      logError('api:register', 'Auth creation failed', { error: authError });
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // 2. Create school record
    const school = await createSchool({
      name: schoolName,
      admin_user_id: authData.user.id,
    });

    logInfo('api:register', 'User and school registered successfully', { userId: authData.user.id, schoolId: school.id });

    return NextResponse.json({ success: true, school });
  } catch (error: any) {
    logError('api:register', 'Unexpected error', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
