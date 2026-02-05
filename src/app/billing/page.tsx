'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Sidebar from '../../components/Sidebar';
import { toast } from 'sonner';

// Components
import CurrentPlanCard from '../../components/billing/CurrentPlanCard';
import PaymentMethodCard from '../../components/billing/PaymentMethodCard';
import InvoicesTable from '../../components/billing/InvoicesTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';

// Mock Invoice Data
const MOCK_INVOICES = [
  { id: 'inv_123456', date: '2025-06-01', amount: '$0.00', status: 'Paid', plan: 'Free Tier' },
  { id: 'inv_123455', date: '2025-05-01', amount: '$0.00', status: 'Paid', plan: 'Free Tier' },
];

export default function BillingPage() {
  const { colors } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('FREE');
  const [credits, setCredits] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [paymentMethodLoading, setPaymentMethodLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('plan, credits, subscription_status')
        .eq('id', user?.id)
        .maybeSingle();

      if (data) {
        setCurrentPlan(data.plan || 'FREE');
        setCredits(data.credits || 0);
        setSubscriptionStatus(data.subscription_status || null);
      } else {
        setCredits(3);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchSubscription();
    }
  }, [user, authLoading, router, fetchSubscription]);

  const handleCheckout = async (planType: string) => {
    if (!user) return;

    try {
      setCheckoutLoading(planType);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to continue');
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    try {
      setPortalLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to continue');
        return;
      }

      const res = await fetch('/api/subscription/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      if (data.customerPortalUrl) {
        window.open(data.customerPortalUrl, '_blank');
      } else {
        window.open(`${process.env.NEXT_PUBLIC_LEMONSQUEEZY_HOST || 'https://app.lemonsqueezy.com'}/my-orders`, '_blank');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to open portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user) return;

    if (currentPlan !== 'PRO') {
      toast.error('Upgrade to Pro to manage payment methods.');
      return;
    }

    try {
      setPaymentMethodLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to continue');
        return;
      }

      const res = await fetch('/api/subscription/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load payment method URL');
      }

      const url = data.updatePaymentMethodUrl as string | null;
      if (!url) {
        toast.error('No payment method update link available');
        return;
      }

      const lemon = (window as any)?.LemonSqueezy;
      if (lemon?.Url?.Open) {
        lemon.Refresh?.();
        lemon.Url.Open(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update payment method');
    } finally {
      setPaymentMethodLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.primaryBg }}>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            (window as any)?.createLemonSqueezy?.();
            (window as any)?.LemonSqueezy?.Refresh?.();
          } catch {
            // no-op
          }
        }}
      />
      <Sidebar />

      <main className="flex-1 md:ml-72 p-4 md:p-12 overflow-y-auto pt-16 md:pt-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <PageHeader
            title="Billing & Subscription"
            description="Manage your subscription plan and view payment history."
          />

          <CurrentPlanCard
            currentPlan={currentPlan}
            credits={credits}
            subscriptionStatus={subscriptionStatus}
            checkoutLoading={checkoutLoading}
            portalLoading={portalLoading}
            onCheckout={handleCheckout}
            onManageSubscription={handleManageSubscription}
          />

          <PaymentMethodCard
            currentPlan={currentPlan}
            paymentMethodLoading={paymentMethodLoading}
            onAddPaymentMethod={handleAddPaymentMethod}
          />

          <InvoicesTable invoices={MOCK_INVOICES} />
        </div>
      </main>
    </div>
  );
}
