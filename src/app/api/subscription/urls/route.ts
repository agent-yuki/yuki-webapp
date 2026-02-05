import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'LemonSqueezy configuration missing' }, { status: 500 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
    }

    if (!profile?.subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${profile.subscription_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('LemonSqueezy API error fetching subscription:', res.status, errorBody);
      return NextResponse.json({ error: 'Failed to fetch subscription from LemonSqueezy' }, { status: 502 });
    }

    const json = await res.json();

    // Lemon Squeezy returns URLs on the subscription object; these expire after ~24h.
    const urls = json?.data?.attributes?.urls ?? {};

    return NextResponse.json({
      customerPortalUrl: urls.customer_portal ?? null,
      updatePaymentMethodUrl: urls.update_payment_method ?? null,
      raw: { urls },
    });
  } catch (error) {
    console.error('Subscription URLs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
