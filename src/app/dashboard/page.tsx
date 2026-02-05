'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { incidentService } from '../../services/incidentService';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import { LanguageIcon } from '../../components/LanguageIcon';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [stats, setStats] = useState({ total: 0, issues: 0, highSeverity: 0 });

  useEffect(() => {
    if (!authLoading && !user) router.push('/');
  }, [authLoading, user, router]);

  const fetchMyScans = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await incidentService.getUserIncidents(user.id, 0, 50);

      const scans = data || [];
      setRecentScans(scans);

      // Calc Stats
      const total = scans.length;
      const issues = scans.reduce((acc: number, curr: any) => acc + (curr.vulnerabilities?.length || 0), 0);
      const highSeverity = scans.filter((s: any) => s.severity === 'High' || s.severity === 'Critical').length;
      setStats({ total, issues, highSeverity });

    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchMyScans();
  }, [user, fetchMyScans]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-72 p-4 md:p-12 overflow-y-auto pt-16 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-12"
        >

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Overview of your security posture
              </p>
            </div>
            <div>
              <Link
                href="/scan"
                className="px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <span>+</span> New Scan
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:border-accent/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1 text-muted-foreground">Total Scans</div>
                <div className="text-3xl font-black text-foreground">{stats.total}</div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:border-rose-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1 text-muted-foreground">Issues Found</div>
                <div className="text-3xl font-black text-rose-500">{stats.issues}</div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:border-orange-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1 text-muted-foreground">Critical Risks</div>
                <div className="text-3xl font-black text-orange-500">{stats.highSeverity}</div>
              </div>
            </div>
          </div>

          {/* Recent Scans History */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              Recent Activity
            </h2>

            {loadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[72px] rounded-xl border border-border bg-card/30 animate-pulse relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
                    <div className="p-4 flex items-center justify-between h-full">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-muted/20" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-muted/20 rounded" />
                          <div className="h-2 w-24 bg-muted/20 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentScans.length === 0 ? (
              <div
                className="py-12 text-center rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-8 opacity-60"
              >
                <h3 className="font-bold mb-1 text-foreground">No scans yet</h3>
                <Link href="/scan" className="text-sm hover:underline text-accent">Start your first analysis</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {recentScans.map((scan) => (
                  <Link
                    href={`/report/${scan.id}`}
                    key={scan.id}
                    className="group block p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(229,255,93,0.05)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Language Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/10 bg-black/20 group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors"
                        >
                          <LanguageIcon language={scan.language} color="hsl(var(--accent))" />
                        </div>

                        <div>
                          <h3 className="font-bold text-sm mb-0.5 font-mono text-foreground group-hover:text-accent transition-colors">
                            {scan.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                            <span>{new Date(scan.timestamp).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px]">{scan.language || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 text-muted-foreground">Findings</span>
                          <span className={`text-lg font-bold font-mono tracking-tight ${(scan.vulnerabilities?.length || 0) > 0 ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-accent drop-shadow-[0_0_8px_rgba(229,255,93,0.5)]'
                            }`}>
                            {scan.vulnerabilities?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </main>
    </div>
  );
}
