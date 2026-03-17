import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { plan, interval } = await request.json();
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const planData = PLANS[plan as keyof typeof PLANS];
    if (!planData) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const priceId = interval === 'annual' ? planData.annualPriceId : planData.monthlyPriceId;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { supabase_uid: user.id, plan, interval },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
