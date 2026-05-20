import { NextRequest, NextResponse } from 'next/server';
import { parseCommand } from '@/lib/whatsapp/parser';
import { handleRun } from '@/lib/whatsapp/handlers/run';
import { handleSave } from '@/lib/whatsapp/handlers/save';
import { handleLibrary } from '@/lib/whatsapp/handlers/library';
import { handleArticle } from '@/lib/whatsapp/handlers/article';
import type { WaMessage, WaResponse } from '@/types/whatsapp';

// Webhook verification for Meta
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');
  
  if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Process incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract message from WhatsApp Cloud API format
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message || message.type !== 'text') {
      return NextResponse.json({ status: 'ignored' });
    }

    const incoming: WaMessage = {
      from: message.from,
      text: message.text.body,
      messageId: message.id,
      timestamp: message.timestamp,
    };

    // Parse and handle command
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

    // Send all responses via WhatsApp API
    await Promise.all(responses.map(sendWhatsAppMessage));

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] Error processing message:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function sendWhatsAppMessage(msg: WaResponse): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error('[Webhook] Missing WhatsApp credentials');
    return;
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: msg.to,
    type: 'text',
    text: {
      body: msg.text,
      preview_url: msg.preview_url ?? false,
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error('[Webhook] Failed to send message:', error);
  }
}
