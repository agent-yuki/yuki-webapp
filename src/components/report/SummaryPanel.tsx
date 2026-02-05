'use client';

interface SummaryPanelProps {
  summary: string;
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="bg-[#111] rounded-xl border border-gray-800 p-6">
      <h3 className="text-white font-bold mb-4">AI Analysis Summary</h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary || 'No summary available.'}</p>
    </div>
  );
}
