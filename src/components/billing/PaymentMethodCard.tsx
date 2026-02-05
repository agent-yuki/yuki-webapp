'use client';

import { useTheme } from '../../contexts/ThemeContext';

interface PaymentMethodCardProps {
  currentPlan: string;
  paymentMethodLoading: boolean;
  onAddPaymentMethod: () => void;
}

export default function PaymentMethodCard({
  currentPlan,
  paymentMethodLoading,
  onAddPaymentMethod,
}: PaymentMethodCardProps) {
  const { colors, theme } = useTheme();

  return (
    <div
      className="rounded-2xl p-8 border shadow-lg"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.borderDark,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Payment Method
        </h2>
        <button
          onClick={onAddPaymentMethod}
          disabled={paymentMethodLoading}
          className="text-sm font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: colors.accent }}
        >
          {paymentMethodLoading ? 'Opening…' : '+ Add New'}
        </button>
      </div>

      {currentPlan !== 'PRO' ? (
        <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
          Payment methods are available after upgrading to Pro.
        </p>
      ) : null}

      <div
        className="p-4 rounded-xl border flex items-center justify-between"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
          borderColor: colors.borderDark,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-6 bg-gray-600 rounded flex items-center justify-center text-[10px] text-white font-mono">
            CARD
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
              •••• •••• •••• 1234
            </p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Expires 12/28
            </p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20">
          Default
        </span>
      </div>
    </div>
  );
}
