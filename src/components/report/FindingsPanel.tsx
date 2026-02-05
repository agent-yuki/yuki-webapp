'use client';

import { CheckIcon } from '../icons/ReportIcons';

interface Vulnerability {
  name: string;
  severity: string;
  description?: string;
}

interface FindingsPanelProps {
  vulnerabilities: Vulnerability[];
}

export default function FindingsPanel({ vulnerabilities }: FindingsPanelProps) {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <div className="bg-[#111] rounded-xl border border-gray-800 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-900/20 text-green-500 mb-4">
          <CheckIcon />
        </div>
        <h3 className="text-white font-bold mb-2">No Issues Found</h3>
        <p className="text-gray-400 text-sm">The automated analysis did not detect any known vulnerabilities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vulnerabilities.map((vuln, idx) => (
        <div key={idx} className="bg-[#0f0f0f] rounded-lg border border-[#222] overflow-hidden">
          <div className="p-4 flex justify-between items-start border-b border-[#222]">
            <h3 className="font-bold text-gray-200 text-sm leading-tight max-w-[85%]">{vuln.name}</h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                vuln.severity.toLowerCase() === 'high'
                  ? 'bg-[#3f1616] text-[#ff4d4d] border border-[#5c2222]'
                  : vuln.severity.toLowerCase() === 'medium'
                  ? 'bg-[#3f2e16] text-[#ffb84d] border border-[#5c4222]'
                  : 'bg-[#16263f] text-[#4d94ff] border border-[#22385c]'
              }`}
            >
              {vuln.severity}
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-1.5">Description</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {vuln.description ||
                  "The function allows the owner to withdraw the current reward and update it. If the owner front-runs a user's claimReward transaction, they can steal the reward."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-1.5">Recommendation</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ensure the reward update and withdrawal are atomic with the claim process. Consider using a commit-reveal
                scheme.
              </p>
            </div>

            <div className="pt-3">
              <span className="text-xs text-gray-500">
                Affected Lines <span className="text-gray-400 ml-2">Line 17 - 26</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
