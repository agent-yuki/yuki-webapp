'use client';

import { WarningIcon, FileIcon, LayersIcon } from '../icons/ReportIcons';

type TabType = 'findings' | 'summary' | 'diagram';

interface ReportTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const tabs = [
    { id: 'findings' as TabType, label: 'Findings', icon: <WarningIcon /> },
    { id: 'summary' as TabType, label: 'Code Summary', icon: <FileIcon /> },
    { id: 'diagram' as TabType, label: 'Protocol Diagram', icon: <LayersIcon /> },
  ];

  return (
    <div className="flex items-center bg-transparent border-b border-[#222] mb-6 flex-shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
            activeTab === tab.id
              ? 'border-[#333] text-white bg-[#111]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}
