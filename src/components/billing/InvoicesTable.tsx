'use client';

import { useTheme } from '../../contexts/ThemeContext';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  plan: string;
}

interface InvoicesTableProps {
  invoices: Invoice[];
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  const { colors, theme } = useTheme();

  return (
    <div
      className="rounded-2xl border shadow-lg overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.borderDark,
      }}
    >
      <div className="p-8 border-b" style={{ borderColor: colors.borderDark }}>
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Invoices
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
              <th className="px-8 py-4 font-bold" style={{ color: colors.textSecondary }}>
                Date
              </th>
              <th className="px-8 py-4 font-bold" style={{ color: colors.textSecondary }}>
                Plan
              </th>
              <th className="px-8 py-4 font-bold" style={{ color: colors.textSecondary }}>
                Amount
              </th>
              <th className="px-8 py-4 font-bold" style={{ color: colors.textSecondary }}>
                Status
              </th>
              <th className="px-8 py-4 font-bold text-right" style={{ color: colors.textSecondary }}></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: colors.borderDark }}>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="group hover:bg-white/5 transition-colors">
                <td className="px-8 py-4" style={{ color: colors.textPrimary }}>
                  {invoice.date}
                </td>
                <td className="px-8 py-4" style={{ color: colors.textPrimary }}>
                  {invoice.plan}
                </td>
                <td className="px-8 py-4" style={{ color: colors.textPrimary }}>
                  {invoice.amount}
                </td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="font-bold hover:underline" style={{ color: colors.accent }}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
