import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

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
