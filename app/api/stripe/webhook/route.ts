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
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const uid = session.metadata?.supabase_uid;
    const plan = session.metadata?.plan;
    if (uid && plan) {
      await supabase.from('profiles').update({
        subscription_tier: plan,
        stripe_subscription_id: session.subscription,
      }).eq('id', uid);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', sub.id)
      .single();
    if (profile) {
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free', stripe_subscription_id: null })
        .eq('id', profile.id);
    }
  }

  return NextResponse.json({ received: true });
}
