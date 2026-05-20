import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { parseCommand } from '@/lib/whatsapp/parser';
import { handleRun } from '@/lib/whatsapp/handlers/run';
import { handleSave } from '@/lib/whatsapp/handlers/save';
import { handleLibrary } from '@/lib/whatsapp/handlers/library';
import { handleArticle } from '@/lib/whatsapp/handlers/article';
import type { WaMessage, WaResponse } from '@/types/whatsapp';

function getWebhookConfig() {
  return {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? process.env.META_WEBHOOK_VERIFY_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? process.env.META_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? process.env.META_WHATSAPP_TOKEN,
    appSecret: process.env.META_APP_SECRET,
  };
}

function verifyWebhookSignature(rawBody: string, signature: string | null, appSecret: string): boolean {
  if (!signature) return false;

  const expected = `sha256=${createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`;
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  
  if (sigBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(sigBuffer, expectedBuffer);
}

export async function GET(req: NextRequest) {
  const { verifyToken } = getWebhookConfig();
  const mode = req.nextUrl.searchParams.get('hub.mode');
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');

  if (!verifyToken) {
    console.error('[Webhook] Verify token not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (mode !== 'subscribe' || !challenge) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  if (token !== verifyToken) {
    console.warn('[Webhook] Verify token mismatch');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return new NextResponse(challenge, { 
    status: 200, 
    headers: { 'Content-Type': 'text/plain' } 
  });
}

export async function POST(req: NextRequest) {
  const { appSecret } = getWebhookConfig();

  const rawBody = await req.text();

  if (!appSecret) {
    console.error('[Webhook] META_APP_SECRET not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const signature = req.headers.get('x-hub-signature-256');
  if (!verifyWebhookSignature(rawBody, signature, appSecret)) {
    console.warn('[Webhook] Signature verification failed');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = JSON.parse(rawBody);
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || message.type !== 'text') {
      return NextResponse.json({ status: 'ignored' });
    }

    const incoming: WaMessage = {
      from: message.from,
      text: message.text.body,
      messageId: message.id,
      timestamp: message.timestamp,
    };

    // Process in background to prevent Meta timeouts
    after(async () => {
      await processMessageInBackground(incoming);
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] Error processing request:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function processMessageInBackground(incoming: WaMessage) {
  try {
    const command = parseCommand(incoming.text);
    let responses: WaResponse[] = [];

    switch (command.verb) {
      case 'SAVE':
        responses = [await handleSave(incoming.from, command.arg)];
        break;
      case 'RUN':
        responses = [await handleRun(incoming.from, command.arg)];
        break;
      case 'ARTICLE':
        responses = await handleArticle(incoming.from, command.arg);
        break;
      case 'LIBRARY':
        responses = [await handleLibrary(incoming.from)];
        break;
      case 'HELP':
      case 'MENU':
        responses = [{
          to: incoming.from,
          text: "SAVE <tool> — save tool\nRUN <tool> — run tool\nLIBRARY — your items\n\nsor7ed.com/tools",
        }];
        break;
      default:
        responses = [{
          to: incoming.from,
          text: "Unknown command\nTry: SAVE <tool> or visit sor7ed.com/tools",
        }];
    }

    const results = await Promise.allSettled(responses.map(sendWhatsAppMessage));
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error(`[Webhook] Message ${i + 1}/${results.length} failed:`, result.reason);
      }
    });
  } catch (error) {
    console.error('[Webhook] Background processing error:', error);
  }
}

async function sendWhatsAppMessage(msg: WaResponse): Promise<void> {
  const { phoneNumberId, accessToken } = getWebhookConfig();

  if (!phoneNumberId || !accessToken) {
    throw new Error('Missing WhatsApp credentials');
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: msg.to,
          type: 'text',
          text: {
            body: msg.text,
            preview_url: msg.preview_url ?? false,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`WhatsApp API ${res.status}: ${errorBody}`);
    }
  } catch (error) {
    console.error(`[Webhook] Error sending message to ${msg.to}:`, error);
    throw error;
  }
}
