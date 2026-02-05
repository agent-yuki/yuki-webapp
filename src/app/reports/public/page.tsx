'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { incidentService } from '@/services/incidentService';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Link from 'next/link';

export default function PublicReports() {
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

    if (user) {
      fetchPublicReports();
    }
  }, [user, authLoading, router]);

  const fetchPublicReports = async () => {
    try {
      const { data } = await incidentService.getPublicIncidents(0, 50);
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching public reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.primaryBg }}>
      <Sidebar />

      <main className="flex-1 ml-72 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                Public Reports
              </h1>
              <p className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                Explore security analysis reports shared by the community
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.accent }}></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="py-16 text-center opacity-50">
              No public reports available yet.
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
