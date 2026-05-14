// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('⚠️ Stripe webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle successful checkout sessions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const credits = parseInt(session.metadata?.credits_to_add ?? '0', 10);

    if (userId && credits > 0) {
      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        amount: credits,
        transaction_type: 'purchase',
        stripe_session_id: session.id,
      });

      const { error: rpcError } = await supabaseAdmin.rpc('increment_concierge_credits', {
        x_user_id: userId,
        x_amount: credits,
      });
      if (rpcError) {
        console.error('Failed to increment credits via RPC:', rpcError);
      }

      // Owner notification via WhatsApp Business API
      await notifyOwnerOfPurchase(userId, credits, session.amount_total);
    }
  }

  return NextResponse.json({ received: true });
}

async function notifyOwnerOfPurchase(userId: string, credits: number, amountTotal: number | null) {
  const message = `💰 *Credit Purchase*\nUser: ${userId}\nCredits: ${credits}\nAmount: £${(amountTotal ?? 0) / 100}\nTime: ${new Date().toLocaleString()}`;
  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.OWNER_WHATSAPP_NUMBER,
          type: 'text',
          text: { body: message },
        }),
      }
    );
  } catch (e) {
    console.error('Owner notification failed:', e);
  }
}
