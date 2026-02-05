'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

function CheckoutSuccessContent() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-redirect to dashboard after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

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
          {/* Success Icon */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.accent}20` }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke={colors.accent}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Payment Successful!
          </h1>

          {/* Description */}
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Thank you for your purchase! Your credits or subscription has been
            activated and is ready to use.
          </p>

          {/* Order Info */}
          <div
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: colors.secondaryBg }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.accent,
                color: colors.primaryBg,
              }}
            >
              Go to Dashboard
            </Link>

            <Link
              href="/billing"
              className="block w-full py-3 rounded-xl font-bold text-sm border transition-all hover:opacity-80"
              style={{
                borderColor: colors.borderDark,
                color: colors.textSecondary,
              }}
            >
              View Billing Details
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <p
            className="mt-6 text-sm"
            style={{ color: colors.textSecondary, opacity: 0.6 }}
          >
            Redirecting to dashboard in {countdown} seconds...
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
