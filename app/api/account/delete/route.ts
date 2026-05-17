import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const getAdmin = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdmin();

  // Delete all user data in order (FK constraints)
  await Promise.all([
    admin.from('user_favorites').delete().eq('user_id', user.id),
    admin.from('assessment_history').delete().eq('user_id', user.id),
    admin.from('saved_items').delete().eq('user_id', user.id),
  ]);
  await admin.from('users').delete().eq('user_id', user.id);

  // Delete the auth user last
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('Failed to delete auth user:', error.message);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
