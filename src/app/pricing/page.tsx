'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';

export default function PricingPage() {
  const { colors } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanSelection = async (planName: string, planType?: string) => {
    // If user is not logged in, show auth modal or redirect
    if (!user) {
      toast.error('Please sign in to continue');
      // You could also open an auth modal here
      return;
    }

    if (planName === 'Free') {
      // Already on free tier or just getting started
      router.push('/dashboard');
      return;
    }

    if (planName === 'Enterprise') {
      // Contact sales - could open mailto or a form
      window.location.href = 'mailto:sales@agentyuki.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    // For Pro plan, initiate checkout
    if (planType) {
      try {
        setLoadingPlan(planName);

        // Get the session token
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

        // Redirect to LemonSqueezy checkout
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      } finally {
        setLoadingPlan(null);
      }
    }
  };

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for testing and small contract audits.',
      features: [
        '3 Free Credits',
        'Public Scans Only',
        'Basic Vulnerability Detection',
        'Community Support',
        'Standard Analysis Speed'
      ],
      cta: 'Start for Free',
      highlighted: false,
      planType: null,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'For serious developers requiring privacy and volume.',
      features: [
        '50 Credits per month',
        'Private Scans Included',
        'Deep Logic Analysis',
        'Priority Processing Queue',
        'PDF Export',
        'Email Support'
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
      planType: 'PRO_MONTHLY',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For protocols and organizations needing scale.',
      features: [
        'Custom Credit Volume',
        'API Access',
        'On-premise / Private Cloud',
        'Dedicated Security Engineer',
        'SLA Support',
        'Audit Certification'
      ],
      cta: 'Contact Sales',
      highlighted: false,
      planType: null,
    }
  ];

  return (
    <div className="min-h-screen selection:bg-cyan-500 selection:text-white" style={{ backgroundColor: colors.primaryBg }}>
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            Simple, Transparent <span style={{ color: colors.accent }}>Pricing</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            Choose the perfect plan to secure your Web3 innovations.
          </p>
        </div>

        {/* Pricing Grids */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border flex flex-col transition-all duration-300 ${tier.highlighted ? 'transform md:-translate-y-4 hover:shadow-xl' : 'hover:shadow-lg'}`}
              style={{
                backgroundColor: tier.highlighted ? colors.cardBg : colors.secondaryBg,
                borderColor: tier.highlighted ? colors.accent : colors.borderDark,
                borderWidth: tier.highlighted ? '2px' : '1px'
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: colors.accent, color: colors.primaryBg }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold" style={{ color: tier.highlighted ? colors.accent : colors.textPrimary }}>{tier.price}</span>
                  {tier.period && <span className="text-sm" style={{ color: colors.textSecondary }}>{tier.period}</span>}
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={colors.accent}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelection(tier.name, tier.planType || undefined)}
                disabled={loadingPlan === tier.name}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-200 transform active:scale-95 ${tier.highlighted ? 'hover:opacity-90' : 'hover:bg-opacity-80'} disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  backgroundColor: tier.highlighted ? colors.accent : colors.panelDark,
                  color: tier.highlighted ? colors.primaryBg : colors.textPrimary,
                  border: tier.highlighted ? 'none' : `1px solid ${colors.borderDark}`
                }}
              >
                {loadingPlan === tier.name ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  tier.cta
                )}
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
