# LemonSqueezy Payment Integration Plan

## Overview
We will integrate LemonSqueezy to handle:
1.  **One-time Credit Top-ups** (e.g., Buy 50 Credits).
2.  **Pro Plan Subscriptions** (Monthly recurring).

LemonSqueezy acts as the Merchant of Record (MoR), handling taxes and invoices. We simply generate checkout links and listen for webhooks to provision access/credits.

## 1. Prerequisites
1.  **LemonSqueezy Account**: Create an account at [lemonsqueezy.com](https://lemonsqueezy.com).
2.  **Store Setup**: Create a store in "Test Mode".
3.  **Products**:
    *   **Credit Pack (One-time)**: Create a "50 Credits" product.
    *   **Pro Plan (Subscription)**: Create a "Pro Membership" product.
4.  **API Keys**: Generate an API Key in Settings > API.
5.  **Webhook Secret**: Define a generic secret (e.g., `random_string`) for verifying webhooks.

## 2. Environment Variables
Add these to your `.env.local`:

```
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LEMONSQUEEZY_HOST=https://app.lemonsqueezy.com
```

## 3. Database Schema Updates
To ensure safety and data integrity, we will apply these schema changes:

**1. Update `profiles` table**
*   `lemon_customer_id`: **(Critical)** To generate Customer Portal links for users to manage their own subscriptions.
*   `subscription_id`: Stores the LS Subscription ID.
*   `subscription_status`: `active`, `past_due`, `cancelled`, `expired`.

**2. Create `webhook_events` table (Idempotency)**
*   To prevent double-counting credits if LemonSqueezy retries a webhook.
*   Columns: `id (uuid)`, `event_id (text unique)`, `type (text)`, `processed_at (timestamp)`.

## 4. Implementation Strategy

### A. Backend - Checkout API (Secure)
**File:** `src/app/api/checkout/route.ts`

**Security Check:** Define Variant IDs in a server-side constant map. Do not trust raw IDs from the client.

```typescript
const PLANS = {
  'CREDITS_50': process.env.LEMONSQUEEZY_VARIANT_CREDITS_50,
  'PRO_MONTHLY': process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY
};
```

**Logic:**
1.  **Auth**: Get `user` from Supabase Auth. Return 401 if missing.
2.  **Validate**: Ensure `body.planType` matches a key in `PLANS`.
3.  **Call LemonSqueezy**:
    ```json
    {
      "data": {
        "type": "checkouts",
        "attributes": {
          "checkout_data": {
            "custom": {
              "user_id": user.id // SECURE INJECTION
            }
          }
        },
        "relationships": {
          "store": { "data": { "type": "stores", "id": process.env.LEMONSQUEEZY_STORE_ID } },
          "variant": { "data": { "type": "variants", "id": PLANS[planType] } }
        }
      }
    }
    ```
4.  Return the `data.attributes.url`.

### B. Backend - Webhook Handler (Idempotent)
**File:** `src/app/api/webhooks/lemonsqueezy/route.ts`

**Workflow:**
1.  **Verify Signature**: `crypto.createHmac` using `LEMONSQUEEZY_WEBHOOK_SECRET`.
2.  **Idempotency Check**:
    *   Query `webhook_events` for `body.meta.event_id`.
    *   If exists, return 200 immediately (do not re-process).
3.  **Route Logic**:
    *   `order_created` -> **One-Time Top-up**:
        *   Call RPC: `increment_credits(user_id, 50)` (Atomic update).
    *   `subscription_created`:
        *   Update `profiles`: plan='PRO', sub_id=..., customer_id=...
    *   `subscription_updated`:
        *   Sync status (e.g., if `past_due`).
    *   `subscription_cancelled`:
        *   Downgrade to 'FREE' at period end (check `ends_at`).
4.  **Mark Processed**: Insert `body.meta.event_id` into `webhook_events`.

### C. Customer Portal (Self-Serve)
Allow users to manage their subscription (cancel, update card).

**File:** `src/app/api/billing-portal/route.ts`
1.  Get `lemon_customer_id` from `profiles`.
2.  Call LS API: `https://api.lemonsqueezy.com/v1/customers/{id}` (or generate a hosted URL).
3.  Redirect user.

**File:** `src/app/api/webhooks/lemonsqueezy/route.ts`

**Dependencies:**
`npm install @lmsqueezy/lemonsqueezy.js`

**Workflow:**
1.  **Verify Signature**: Ensure request is from LemonSqueezy using `crypto.createHmac` and `LEMONSQUEEZY_WEBHOOK_SECRET`.
2.  **Parse Event**: Check `event_name` (`order_created`, `subscription_created`, `subscription_updated`).
3.  **Extract Data**:
    *   `user_id`: From `meta.custom_data.user_id`.
    *   `credits`: Determine based on `variant_id`.
4.  **Update Supabase**:

#### Logic for Events:

*   **`order_created` (One-time purchases)**
    *   Verify status is `paid`.
    *   Get `user_id` from custom data.
    *   **Action**: `UPDATE profiles SET credits = credits + 50 WHERE id = user_id`.

*   **`subscription_created` / `subscription_updated`**
    *   Get `user_id`.
    *   Get `status` (active, past_due, etc).
    *   **Action**: `UPDATE profiles SET plan = 'PRO', subscription_id = '...', subscription_status = 'active' WHERE id = user_id`.
    *   *Note*: If status is `expired`/`cancelled`, downgrade plan to `FREE`.

### C. Webhook Verification Code Snippet
```typescript
import crypto from 'crypto';

const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const hmac = crypto.createHmac('sha256', secret);
const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
const signature = Buffer.from(request.headers.get('x-signature') || '', 'utf8');

if (!crypto.timingSafeEqual(digest, signature)) {
  return new Response('Invalid signature', { status: 401 });
}
```

## 5. Testing Steps

1.  **Local Testing**:
    *   Use **ngrok** to expose your local port: `ngrok http 3000`.
    *   Add the `https://....ngrok.io/api/webhooks/lemonsqueezy` URL to LemonSqueezy Settings > Webhooks.
2.  **Test Purchase**:
    *   Use LemonSqueezy "Test Mode" card numbers (usually `4242...`).
    *   Click "Buy" in your app.
    *   Check Supabase `profiles` to see if credits increased or plan changed.

## 6. Security Checklist
- [ ] Verify Webhook Secret.
- [ ] Ensure `checkout[custom][user_id]` is always populated.
- [ ] Handle duplicate webhook events (idempotency) - optional for MVP but good for scale.
- [ ] Use `RPC` functions for credit addition to avoid race conditions (e.g., `increment_credits(user_id, amount)`).

