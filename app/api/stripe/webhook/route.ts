import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('[webhook] signature error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  // ── Paiement initial validé ───────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const uid = session.metadata?.supabase_uid;
    const plan = session.metadata?.plan;
    if (uid && plan) {
      const { error } = await supabase.from('profiles').update({
        subscription_tier: plan,
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
      }).eq('id', uid);
      if (error) console.error('[webhook] checkout update error:', error);
      else console.log(`[webhook] ✓ ${uid} → plan ${plan}`);
    }
  }

  // ── Abonnement mis à jour (upgrade/downgrade) ─────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as any;
    const priceId = sub.items?.data?.[0]?.price?.id;
    if (!priceId) return NextResponse.json({ received: true });

    // Retrouver le plan depuis l'ID prix
    const { PLANS } = await import('@/lib/stripe');
    let newTier: string | null = null;
    for (const [key, plan] of Object.entries(PLANS)) {
      if (plan.monthlyPriceId === priceId || plan.annualPriceId === priceId) {
        newTier = key;
        break;
      }
    }
    if (!newTier) return NextResponse.json({ received: true });

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', sub.id)
      .single();

    if (profile) {
      await supabase.from('profiles').update({ subscription_tier: newTier }).eq('id', profile.id);
      console.log(`[webhook] ✓ subscription updated → ${newTier}`);
    }
  }

  // ── Abonnement annulé ─────────────────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', sub.id)
      .single();
    if (profile) {
      await supabase.from('profiles').update({
        subscription_tier: 'free',
        stripe_subscription_id: null,
      }).eq('id', profile.id);
      console.log(`[webhook] ✓ subscription deleted → free`);
    }
  }

  return NextResponse.json({ received: true });
}
