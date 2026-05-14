import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

const PARK_MESSAGE = `PARKED 🤍\n\nEverything is safe. Nothing is lost.\n\nYour state is saved. I will not move forward until you say you're ready.\n\nWhen you have capacity, just message me anything—even just "hi"—and I'll give you one tiny next step.\n\nNo pressure. No timeline.`;

// Simple helper to detect PARK command (case‑insensitive)
function isParkCommand(text: string): boolean {
  return /^\s*park\s*$/i.test(text.trim());
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  // If the last user message is a PARK command, short‑circuit with the static response
  const lastMessage = messages?.[messages.length - 1];
  if (lastMessage?.role === 'user' && isParkCommand(lastMessage?.content)) {
    return new Response(PARK_MESSAGE, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are the SOR7ED Protocol Assistant. Your goal is to help neurodivergent individuals 
    create practical, actionable protocols across 7 branches: Keep Going (Routine), Feel Good (Health), 
    Spend Smart (Finance), Be Connected (Relationships), Plan Ahead (Organization), Be Yourself (Identity), 
    and Level Up (Growth). Keep responses concise, supportive, and structured.`,
  });

  return result.toTextStreamResponse();
}
