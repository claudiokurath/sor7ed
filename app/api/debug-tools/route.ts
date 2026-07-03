import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('tools')
    .select('slug, status, featured')
    .in('slug', ['adhd-tax-calculator','financial-autopilot','decision-paralysis-solver']);
  return NextResponse.json(data);
}
