'use client';

import Link from 'next/link';
import { useTheme } from '../../../contexts/ThemeContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CheckoutCancelPage() {
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen selection:bg-cyan-500 selection:text-white flex flex-col"
      style={{ backgroundColor: colors.primaryBg }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center border"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderDark,
          }}
        >
          {/* Cancel Icon */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ef4444"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Payment Cancelled
          </h1>

          {/* Description */}
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Your payment was cancelled. No charges have been made to your
            account.
          </p>

          {/* Info Box */}
          <div
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: colors.secondaryBg }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              If you experienced any issues during checkout, please contact our
              support team.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/pricing"
              className="block w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.accent,
                color: colors.primaryBg,
              }}
            >
              Return to Pricing
            </Link>

            <Link
              href="/"
              className="block w-full py-3 rounded-xl font-bold text-sm border transition-all hover:opacity-80"
              style={{
                borderColor: colors.borderDark,
                color: colors.textSecondary,
              }}
            >
              Go to Home
            </Link>
          </div>

          {/* Help Link */}
          <p className="mt-6 text-sm" style={{ color: colors.textSecondary }}>
            Need help?{' '}
            <a
              href="mailto:support@agentyuki.com"
              className="font-bold hover:underline"
              style={{ color: colors.accent }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
