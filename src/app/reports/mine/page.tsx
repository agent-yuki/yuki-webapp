'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { incidentService } from '@/services/incidentService';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Link from 'next/link';

export default function MyReports() {
  const { colors, theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
  }, [authLoading, user, router]);

  const fetchMyReports = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await incidentService.getUserIncidents(user.id, 0, 50);
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching my reports:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user, fetchMyReports]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.primaryBg }}>
      <Sidebar />

      <main className="flex-1 ml-72 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                My Reports
              </h1>
              <p className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                Manage and view your personal security scan history
              </p>
            </div>
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${theme === 'light' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              + New Scan
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.accent }}></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed" style={{ borderColor: colors.borderDark }}>
              <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>No reports found</h3>
              <p className="text-sm opacity-60 mb-4" style={{ color: colors.textSecondary }}>
                You haven't run any security scans yet.
              </p>
              <Link
                href="/dashboard"
                className="text-xs font-bold underline decoration-2 underline-offset-4"
                style={{ color: colors.accent }}
              >
                Run your first scan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incidents.map((incident) => (
                <Link href={`/report/${incident.id}`} key={incident.id} className="block h-full">
                  <Card incident={incident} />
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
