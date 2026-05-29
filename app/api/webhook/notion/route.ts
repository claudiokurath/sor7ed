import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This endpoint is called by Notion automations when a page is updated
// It immediately triggers the full Notion → Supabase sync
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-notion-secret') || req.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Call the sync endpoint internally
    const syncUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/sync-notion?force=true`;
    const syncRes = await fetch(syncUrl, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });

    const result = await syncRes.json();
    console.log('[notion-webhook] sync triggered:', result);

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('[notion-webhook] error:', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

// Also support GET for easy manual triggering from browser
export async function GET(req: NextRequest) {
  return POST(req);
}
