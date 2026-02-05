'use client';

import Link from 'next/link';
import { GlobeIcon, FileTextIcon, HeartIcon, ShareIcon, ConversationIcon, ExportIcon } from '../icons/ReportIcons';

interface ReportHeaderProps {
  loading: boolean;
  incident: any;
  user: any;
}

export default function ReportHeader({ loading, incident, user }: ReportHeaderProps) {
  return (
    <div className="border-b border-[#222] bg-[#050505] flex-shrink-0 pt-6 pb-6">
      <div className="container mx-auto px-8">
        {/* Row 1: Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Scan
          </Link>
          <span className="text-gray-600">›</span>
          {loading || !incident ? (
            <div className="h-3 bg-[#222] rounded w-48 animate-pulse"></div>
          ) : (
            <span className="text-gray-300 break-all">{incident.title || 'Unknown Contract'}</span>
          )}
        </div>

        {/* Row 2: Metadata & Actions */}
        <div className="flex justify-between items-start mb-2">
          {loading || !incident ? (
            <div className="flex items-center gap-4 mt-1">
              <div className="h-3 bg-[#222] rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-[#222] rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-[#222] rounded w-24 animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs text-green-500 font-mono mt-1">
              <span>{new Date(incident.timestamp).toLocaleString().replace(',', '')}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">
                  <GlobeIcon />
                </span>
                <span>Public</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">
                  <FileTextIcon />
                </span>
                <span>Full Disclosure</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-500">
                <HeartIcon />
                <span>299</span>
              </div>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] hover:bg-[#222] rounded text-xs text-gray-300 transition-colors">
              <ShareIcon /> Share
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] hover:bg-[#222] rounded text-xs text-gray-300 transition-colors">
              <ConversationIcon /> Conversation
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] hover:bg-[#222] rounded text-xs text-green-500 transition-colors">
              <ExportIcon /> Export
            </button>
          </div>
        </div>

        {/* Row 3: Title & Creator Info */}
        <div className="flex justify-between items-end">
          {loading || !incident ? (
            <div className="space-y-3">
              <div className="h-8 bg-[#222] rounded w-96 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-[#222] rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-[#222] rounded w-12 animate-pulse"></div>
                <div className="h-6 bg-[#222] rounded w-14 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-white mb-3">
                  {incident.title || 'Smart Contract Security Analysis'}
                </h1>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#3f1616] border border-[#5c2222] text-[#ff4d4d] text-[10px] font-bold rounded">
                    High
                  </span>
                  <span className="px-2 py-1 bg-[#1a1a19] border border-[#333] text-gray-400 text-[10px] font-bold rounded">
                    2
                  </span>
                  <span className="px-2 py-1 bg-[#1a1a19] border border-[#333] text-gray-400 text-[10px] font-bold rounded">
                    SWC
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Created By:</span>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-[10px] font-bold">
                      {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="text-gray-400">
                      {user?.user_metadata?.full_name || user?.email || 'Unknown User'}
                    </span>
                  </div>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-500">
                    Credit Usage: <span className="text-gray-300">21</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
