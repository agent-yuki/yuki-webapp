'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import Sidebar from '../../../components/Sidebar';
import { toast } from 'sonner';

// Report Components
import ReportHeader from '../../../components/report/ReportHeader';
import CodeViewer from '../../../components/report/CodeViewer';
import ReportTabs from '../../../components/report/ReportTabs';
import FindingsPanel from '../../../components/report/FindingsPanel';
import SummaryPanel from '../../../components/report/SummaryPanel';
import DiagramPanel from '../../../components/report/DiagramPanel';
import ContentSkeleton from '../../../components/report/ContentSkeleton';

// Mock code for display if none exists in DB
const MOCK_CODE = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.24;

  import {ERC20Internals} from "./helpers/ERC20Internals.sol";
  import {IERC20Errors} from "./helpers/IERC20Errors.sol";

  contract ERC20 is IERC20Errors, ERC20Internals {
      constructor(string memory name_, string memory symbol_) {
          _name = name_;
          _symbol = symbol_;
      }

      function name() public view virtual returns (string memory) {
          return _name;
      }

      function symbol() public view virtual returns (string memory) {
          return _symbol;
      }

      function decimals() public view virtual returns (uint8) {
          return 18;
      }

      function totalSupply() public view virtual returns (uint256) {
          return _totalSupply;
      }

      function balanceOf(address owner) public view returns (uint256) {
          return _balances[owner];
      }

      function transfer(address to, uint256 value) public virtual returns (bool) {
          address owner = msg.sender;
          _transfer(owner, to, value);
          return true;
      }

      function allowance(address owner, address spender) public view virtual returns (uint256) {
          return _allowances[owner][spender];
      }

      function approve(address spender, uint256 value) public virtual returns (bool) {
          address owner = msg.sender;
          _approve(owner, spender, value);
          return true;
      }

      function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
          address spender = msg.sender;
          _spendAllowance(from, spender, value);
          _transfer(from, to, value);
          return true;
      }
  }`;

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'findings' | 'summary' | 'diagram'>('findings');
  const [code, setCode] = useState(MOCK_CODE);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
  }, [authLoading, user, router]);

  const fetchIncident = useCallback(async () => {
    if (!id || !user) return;
    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIncident(data);
        if (data.source_code) setCode(data.source_code);

        // If still processing, subscribe to changes
        const status = data.status;
        if (status === 'Processing' || status === 'Queued' || status === 'Under Review') {
          const channel = supabase
            .channel(`incident-${id}`)
            .on('postgres_changes', {
              event: 'UPDATE',
              schema: 'public',
              table: 'security_incidents',
              filter: `id=eq.${id}`
            }, (payload) => {
              const newStatus = (payload.new as any).status;
              if (newStatus !== 'Processing' && newStatus !== 'Queued' && newStatus !== 'Under Review') {
                setIncident(payload.new);
                toast.success('Analysis Complete!');
                channel.unsubscribe();
              }
            })
            .subscribe();

          return () => { channel.unsubscribe(); };
        }
      }

    } catch (error) {
      console.error('Error fetching incident:', error);
      toast.error('Report not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, user, router]);

  useEffect(() => {
    if (id && user) {
      fetchIncident();
    }
  }, [id, user, fetchIncident]);

  const renderContent = () => {
    if (loading || !incident) {
      return <ContentSkeleton />;
    }

    if (incident.status === 'Processing' || incident.status === 'Queued' || incident.status === 'Under Review') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin opacity-50"></div>
          <p className="text-xl font-light tracking-wide text-gray-400">AI Analysis in Progress...</p>
          <p className="text-sm text-gray-600">You can leave this page. The report will update automatically.</p>
        </div>
      );
    }

    if (incident.status === 'Failed') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <h3 className="text-xl">Analysis Failed</h3>
          <p>{incident.analysis_summary || "Unknown error occurred."}</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'findings':
        return <FindingsPanel vulnerabilities={incident.vulnerabilities || []} />;
      case 'summary':
        return <SummaryPanel summary={incident.analysis_summary} />;
      case 'diagram':
        return <DiagramPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative ml-72">
        {/* Top Header Section */}
        <ReportHeader loading={loading} incident={incident} user={user} />

        {/* Main Content Grid */}
        <main className="flex-grow container mx-auto px-8 py-6 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
            {/* Left Column: Code Editor View */}
            <CodeViewer code={code} language={incident?.language} />

            {/* Right Column: Findings & Analysis */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
              <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Tab Content */}
              <div className="flex-grow overflow-auto pr-1 custom-scrollbar">{renderContent()}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
