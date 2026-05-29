import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase
    .from('tools')
    .select('slug, name, status, featured')
    .in('slug', ['adhd-tax-calculator', 'financial-autopilot', 'decision-paralysis-solver']);
  return NextResponse.json({ data, error });
}
