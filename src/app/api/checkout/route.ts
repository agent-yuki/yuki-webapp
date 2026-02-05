import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// Define valid plan types and their variant IDs
const PLANS: Record<string, { variantId: string; credits?: number; type: 'one-time' | 'subscription' }> = {
  CREDITS_50: {
    variantId: process.env.LEMONSQUEEZY_VARIANT_CREDITS_50 || '',
    credits: 50,
    type: 'one-time',
  },
  PRO_MONTHLY: {
    variantId: process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY || '',
    type: 'subscription',
  },
};

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the user's session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { planType } = body;

    // Validate plan type
    if (!planType || !PLANS[planType]) {
      return NextResponse.json(
        { error: 'Invalid plan type. Valid options: ' + Object.keys(PLANS).join(', ') },
        { status: 400 }
      );
    }

    const plan = PLANS[planType];
    
    if (!plan.variantId) {
      return NextResponse.json(
        { error: 'Plan variant not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    // ============ PRO-ONLY GUARD FOR CREDIT PACKS ============
    // One-time credit purchases require an active Pro subscription
    if (plan.type === 'one-time') {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }

      if (profile.plan !== 'PRO') {
        return NextResponse.json(
          { error: 'Credit packs are only available for Pro subscribers. Please upgrade first.' },
          { status: 403 }
        );
      }
    }

    // Check required environment variables
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!storeId || !apiKey) {
      return NextResponse.json(
        { error: 'LemonSqueezy configuration missing' },
        { status: 500 }
      );
    }

    // Get user's email for prefill
    const userEmail = user.email || '';

    // Construct the base URL for redirects
    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create checkout using LemonSqueezy API
    const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: user.id,
                plan_type: planType,
              },
            },
            product_options: {
              redirect_url: `${baseUrl}/checkout/success`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: plan.variantId,
              },
            },
          },
        },
      }),
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json();
      console.error('LemonSqueezy API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const checkoutData = await checkoutResponse.json();
    const checkoutUrl = checkoutData.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkout URL in response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
