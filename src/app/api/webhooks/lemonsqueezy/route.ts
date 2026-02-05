import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// Credit amounts for each plan/product
const CREDIT_AMOUNTS: Record<string, number> = {
  CREDITS_50: 50,
};

// Monthly credits for Pro subscribers
const PRO_MONTHLY_CREDITS = 30;

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Get the raw body for signature verification
    const rawBody = await request.text();
    
    // Get the signature from headers
    const signatureHeader = request.headers.get('X-Signature') || '';
    const signature = Buffer.from(signatureHeader, 'hex');

    if (signature.length === 0 || rawBody.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Verify the signature
    const hmac = Buffer.from(
      crypto.createHmac('sha256', secret).update(rawBody).digest('hex'),
      'hex'
    );

    if (!crypto.timingSafeEqual(hmac, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the webhook data
    const data = JSON.parse(rawBody);
    const eventName = data.meta?.event_name;
    const eventId = data.meta?.event_id;
    const customData = data.meta?.custom_data || {};
    const attributes = data.data?.attributes || {};

    console.log(`Processing webhook event: ${eventName} (${eventId})`);

    // Check for idempotency - skip if we've already processed this event
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Event ${eventId} already processed, skipping`);
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    // Get user ID from custom data
    const userId = customData.user_id;
    const planType = customData.plan_type;

    if (!userId) {
      console.error('No user_id in webhook custom data');
      // Still return 200 to prevent retries for malformed webhooks
      return NextResponse.json({ error: 'No user_id found' }, { status: 200 });
    }

    // Validate userId is a valid UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error('Invalid userId format:', userId);
      return NextResponse.json({ error: 'Invalid user_id format' }, { status: 200 });
    }

    // Handle different event types
    switch (eventName) {
      case 'order_created': {
        // One-time purchase (e.g., credit packs)
        const status = attributes.status;
        
        if (status === 'paid') {
          const creditsToAdd = CREDIT_AMOUNTS[planType] || 50;
          
          // Use atomic RPC function to increment credits
          const { error: updateError } = await supabaseAdmin.rpc('increment_credits', {
            user_id_input: userId,
            amount: creditsToAdd,
          });

          if (updateError) {
            // Fallback (non-atomic): read-then-write.
            // This should be rare now that we ship the RPC in migrations.
            console.error('increment_credits RPC failed, falling back to read-then-write:', updateError);

            const { data: profile, error: profileError } = await supabaseAdmin
              .from('profiles')
              .select('credits')
              .eq('id', userId)
              .single();

            if (!profileError) {
              const currentCredits = profile?.credits ?? 0;
              await supabaseAdmin
                .from('profiles')
                .update({ credits: currentCredits + creditsToAdd })
                .eq('id', userId);
            }
          }

          console.log(`Added ${creditsToAdd} credits to user ${userId}`);
        }
        break;
      }

      case 'subscription_created':
      case 'subscription_updated': {
        // Subscription events
        const subscriptionId = data.data?.id;
        const customerId = attributes.customer_id;
        const status = attributes.status;

        // Determine plan based on status
        const plan = status === 'active' ? 'PRO' : 'FREE';

        // Update profile with subscription info
        await supabaseAdmin
          .from('profiles')
          .update({
            plan,
            subscription_id: subscriptionId?.toString(),
            subscription_status: status,
            lemon_customer_id: customerId?.toString(),
          })
          .eq('id', userId);

        // If subscription just became active, give initial credits
        if (status === 'active') {
          const { error: creditError } = await supabaseAdmin.rpc('increment_credits', {
            user_id_input: userId,
            amount: PRO_MONTHLY_CREDITS,
          });

          if (creditError) {
            console.error('Failed to grant initial monthly credits:', creditError);

            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('credits')
              .eq('id', userId)
              .single();

            const currentCredits = profile?.credits ?? 0;
            await supabaseAdmin
              .from('profiles')
              .update({ credits: currentCredits + PRO_MONTHLY_CREDITS })
              .eq('id', userId);
          }
        }

        console.log(`Updated subscription for user ${userId}: ${plan} (${status})`);
        break;
      }

      case 'subscription_cancelled': {
        // Handle subscription cancellation
        const endsAt = attributes.ends_at;
        
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            // Keep PRO until ends_at
          })
          .eq('id', userId);

        console.log(`Subscription cancelled for user ${userId}, ends at: ${endsAt}`);
        break;
      }

      case 'subscription_payment_success': {
        // Monthly payment received - recharge credits
        const { error: rechargeError } = await supabaseAdmin.rpc('increment_credits', {
          user_id_input: userId,
          amount: PRO_MONTHLY_CREDITS,
        });

        if (rechargeError) {
          console.error('Failed to recharge monthly credits:', rechargeError);
          // Fallback (non-atomic): increment via read-then-write
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          const currentCredits = profile?.credits ?? 0;
          await supabaseAdmin
            .from('profiles')
            .update({ credits: currentCredits + PRO_MONTHLY_CREDITS })
            .eq('id', userId);
        }

        console.log(`Recharged ${PRO_MONTHLY_CREDITS} credits for Pro user ${userId}`);
        break;
      }

      case 'subscription_expired': {
        // Downgrade to FREE when subscription expires
        await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'FREE',
            subscription_status: 'expired',
            subscription_id: null,
          })
          .eq('id', userId);

        console.log(`Subscription expired for user ${userId}, downgraded to FREE`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    // Mark event as processed for idempotency
    // Use upsert with ignoreDuplicates to handle conflicts
    await supabaseAdmin
      .from('webhook_events')
      .upsert(
        {
          event_id: eventId,
          type: eventName,
          processed_at: new Date().toISOString(),
        },
        { 
          onConflict: 'event_id',
          ignoreDuplicates: true 
        }
      );

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 to prevent retries on our errors
    return NextResponse.json({ error: 'Processing failed' }, { status: 200 });
  }
}
