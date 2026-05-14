// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CONCIERGE_CREDIT_PACKS, CreditPackType } from '@/lib/stripe-config';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });

export async function POST(req: NextRequest) {
  try {
    const { packType } = await req.json();
    const pack = CONCIERGE_CREDIT_PACKS[packType as CreditPackType];
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack type' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: pack.price_id, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success&credits=${pack.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/concierge?checkout=canceled`,
      client_reference_id: user.id,
      metadata: {
        pack_type: packType,
        credits_to_add: pack.credits.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
