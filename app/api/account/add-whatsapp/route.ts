import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const WA_NUMBER = '447591922247';

const getAdminClient = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const body = await request.json();
  const whatsapp_number = (body.whatsapp_number ?? '').trim().replace(/\s+/g, '');

  if (!whatsapp_number || whatsapp_number.length < 7) {
    return NextResponse.json({ error: 'Invalid number' }, { status: 400 });
  }

  const waVerifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  const adminClient = getAdminClient();
  const { error } = await adminClient
    .from('users')
    .update({
      whatsapp_number,
      wa_verify_code: waVerifyCode,
      whatsapp_verified: false,
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('add-whatsapp update error:', error.message);
    return NextResponse.json({ error: 'Failed to save number' }, { status: 500 });
  }

  return NextResponse.json({ waVerifyCode, waNumber: WA_NUMBER });
}
