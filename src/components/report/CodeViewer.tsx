'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CodeViewerProps {
  code: string;
  language?: string;
}

export default function CodeViewer({ code, language = '' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const getLanguage = () => {
    const lang = (language || '').toLowerCase();
    if (lang.includes('rust') || lang.includes('move') || lang.includes('solana')) {
      return 'rust';
    }
    if (lang.includes('vyper') || lang.includes('python')) {
      return 'python';
    }
    return 'solidity';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="lg:col-span-7 bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden flex flex-col h-full relative group">
      {/* Floating Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white hover:border-[#555] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>

      <div className="flex-grow overflow-auto p-0 relative font-mono text-sm custom-scrollbar">
        <div className="absolute top-0 left-0 bottom-0 w-10 bg-[#0a0a0a] border-r border-[#222] flex flex-col items-end py-4 pr-3 select-none text-gray-600 text-xs leading-6">
          {(code || '').split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="pl-14 py-4 pr-4 leading-6 text-gray-400">
          <div className="text-gray-500 font-mono text-sm leading-6 mb-2 flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-red-500/20 ring-1 ring-red-500/50"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-500/20 ring-1 ring-yellow-500/50"></span>
            <span className="w-2 h-2 rounded-full bg-green-500/20 ring-1 ring-green-500/50"></span>
            <span className="ml-2 opacity-50 text-xs uppercase tracking-wider">{getLanguage()}</span>
          </div>
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{
              background: 'transparent',
              padding: 0,
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
            }}
            showLineNumbers={false}
            wrapLines={false}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
