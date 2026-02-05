'use client';

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../../components/Sidebar';
import { toast } from 'sonner';

export default function ApiKeysPage() {
  const { colors, theme } = useTheme();

  // Placeholder Data for now
  const [apiKeys, setApiKeys] = useState([
    { id: '1', key: 'yuki_test_84h3...92a1', name: 'Development Key', created: new Date().toISOString(), lastUsed: 'Never' }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API Key copied!');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.primaryBg }}>
      <Sidebar />

      <main className="flex-1 ml-72 p-8 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: colors.textPrimary }}>
              API Keys
            </h1>
            <p className="opacity-60" style={{ color: colors.textSecondary }}>
              Manage your programmatic access keys. Treat these like passwords.
            </p>
          </div>

          {/* Keys List */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderDark
            }}
          >
            <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: colors.borderDark }}>
              <h3 className="font-bold text-sm">Active Keys</h3>
              <button
                onClick={() => toast.error('API Key generation coming soon')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95"
                style={{ backgroundColor: colors.accent, color: colors.primaryBg }}
              >
                + Create New Key
              </button>
            </div>

            <div className="p-6 space-y-4">
              {apiKeys.map(key => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ backgroundColor: colors.secondaryBg, borderColor: colors.borderDark }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>{key.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wide">Active</span>
                    </div>
                    <div className="font-mono text-xs opacity-60" style={{ color: colors.textSecondary }}>
                      {key.key}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs opacity-50" style={{ color: colors.textSecondary }}>
                      <div>Created: {new Date(key.created).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="p-2 rounded hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button
                      className="p-2 rounded hover:bg-red-500/10 text-red-500 transition-colors opacity-60 hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
