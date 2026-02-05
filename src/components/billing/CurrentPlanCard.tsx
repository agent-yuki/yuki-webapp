'use client';

import { useTheme } from '../../contexts/ThemeContext';

interface CurrentPlanCardProps {
  currentPlan: string;
  credits: number;
  subscriptionStatus: string | null;
  checkoutLoading: string | null;
  portalLoading: boolean;
  onCheckout: (planType: string) => void;
  onManageSubscription: () => void;
}

export default function CurrentPlanCard({
  currentPlan,
  credits,
  subscriptionStatus,
  checkoutLoading,
  portalLoading,
  onCheckout,
  onManageSubscription,
}: CurrentPlanCardProps) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl p-8 border relative overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.borderDark,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Current Plan
            </h2>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                backgroundColor: colors.accent,
                color: colors.primaryBg,
              }}
            >
              {currentPlan}
            </span>
          </div>
          <div className="text-3xl font-bold font-mono mt-4" style={{ color: colors.textPrimary }}>
            {credits} <span className="text-base font-normal opacity-60">credits available</span>
          </div>
          <p className="mt-2 text-sm opacity-60 max-w-md" style={{ color: colors.textSecondary }}>
            {currentPlan === 'FREE'
              ? 'Upgrade to Pro for 50 monthly credits and private scans.'
              : subscriptionStatus === 'cancelled'
              ? 'Your subscription is cancelled and will expire at the end of the billing period.'
              : 'Your credits reset on the first of next month.'}
          </p>

          {/* Credit Top-up Buttons */}
          <div className="flex items-center gap-2 mt-4">
            {currentPlan === 'PRO' ? (
              <button
                onClick={() => onCheckout('CREDITS_50')}
                disabled={checkoutLoading === 'CREDITS_50'}
                className="px-3 py-1.5 rounded border text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: colors.borderDark, color: colors.textSecondary }}
              >
                {checkoutLoading === 'CREDITS_50' ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Buy 50 Credits'
                )}
              </button>
            ) : (
              <span className="text-xs opacity-60" style={{ color: colors.textSecondary }}>
                Credit packs are Pro-only
              </span>
            )}
          </div>
        </div>

        {currentPlan === 'FREE' ? (
          <button
            onClick={() => onCheckout('PRO_MONTHLY')}
            disabled={checkoutLoading === 'PRO_MONTHLY'}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] hover:brightness-110 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.accent, color: colors.primaryBg }}
          >
            {checkoutLoading === 'PRO_MONTHLY' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Upgrade to Pro'
            )}
          </button>
        ) : (
          <button
            onClick={onManageSubscription}
            disabled={portalLoading}
            className="px-6 py-3 rounded-xl font-bold text-sm border transition-all hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: colors.borderDark, color: colors.textPrimary }}
          >
            {portalLoading ? 'Opening…' : 'Manage Subscription'}
          </button>
        )}
      </div>

      {/* Decorative Background Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
        style={{ backgroundColor: colors.accent, opacity: 0.05 }}
      />
    </div>
  );
}
