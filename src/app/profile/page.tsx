'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Sidebar from '../../components/Sidebar';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { colors, theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [plan, setPlan] = useState('FREE');

  // 2FA State
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFullName(data.full_name || '');
        setCompanyName(data.company_name || '');
        setPlan(data.plan || 'FREE');
      } else {
        // Fallback to auth metadata if profile doesn't exist yet
        setFullName(user?.user_metadata?.full_name || '');
        setCompanyName(user?.user_metadata?.company_name || '');
      }
    } catch (error: any) {
      toast.error('Error fetching profile');
      console.error('Error:', error);
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
      fetchProfile();
    }
  }, [user, authLoading, router, fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // 1. Update auth metadata (so Navbar updates immediately)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          company_name: companyName,
        }
      });
      if (authError) throw authError;

      // 2. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          company_name: companyName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = () => {
    // Placeholder for actual MFA implementation
    if (!mfaEnabled) {
      // In a real app, this would start the enrollment flow (QR code)
      toast.success('2FA enrollment started (Coming Soon)');
      // toggle for UI demo
      // setMfaEnabled(true); 
    } else {
      setMfaEnabled(false);
      toast.success('2FA disabled');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.primaryBg }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.primaryBg }}>
      <Sidebar />

      <main className="flex-1 md:ml-72 p-4 md:p-12 overflow-y-auto pt-16 md:pt-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: colors.textPrimary }}>Profile Settings</h1>
            <p style={{ color: colors.textSecondary }}>Manage your account settings and preferences.</p>
          </div>

          {/* Profile Form */}
          <div
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderDark
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>Personal Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${colors.borderDark}`,
                    color: colors.textPrimary
                  }}
                  placeholder="John Doe"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${colors.borderDark}`,
                    color: colors.textPrimary
                  }}
                  placeholder="Acme Corp"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm opacity-60 cursor-not-allowed"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${colors.borderDark}`,
                    color: colors.textSecondary
                  }}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: colors.accent, color: colors.primaryBg }}
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div
            className="rounded-2xl p-8 border shadow-lg"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderDark
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>Security</h2>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Two-Factor Authentication</h3>
                <p className="text-sm max-w-sm" style={{ color: colors.textSecondary }}>
                  Add an extra layer of security to your account by requiring a code when logging in.
                </p>
              </div>

              <button
                onClick={handleToggle2FA}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${mfaEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                style={{ backgroundColor: mfaEnabled ? colors.accent : (theme === 'dark' ? '#333' : '#e5e7eb') }}
              >
                <span className="sr-only">Enable 2FA</span>
                <span
                  className={`${mfaEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
                  style={{ backgroundColor: mfaEnabled ? colors.primaryBg : '#fff' }}
                />
              </button>
            </div>

            {/* Plan Badge Display (Info only) */}
            <div className="mt-8 pt-8 border-t flex items-center justify-between" style={{ borderColor: colors.borderDark }}>
              <div>
                <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Current Plan</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Your subscription tier</p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: colors.secondaryBg,
                  border: `1px solid ${colors.borderDark}`,
                  color: colors.accent
                }}
              >
                {plan}
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
