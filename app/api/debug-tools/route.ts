import { NextResponse } from 'next/server';
import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('tools')
    .select('slug, status, featured')
    .in('slug', ['adhd-tax-calculator','financial-autopilot','decision-paralysis-solver']);
  return NextResponse.json(data);
}
