'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Sidebar from '../../components/Sidebar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Components
import ScanTabBar from '../../components/scan/ScanTabBar';
import ScanProgress from '../../components/scan/ScanProgress';
import FileDropzone from '../../components/scan/FileDropzone';
import TagInput from '../../components/scan/TagInput';
import VisibilityDropdown from '../../components/scan/VisibilityDropdown';
import PageHeader from '../../components/common/PageHeader';

export default function ScanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Scan State
  const [scanMode, setScanMode] = useState<'ADDRESS' | 'CODE' | 'FILES'>('ADDRESS');
  const [contractAddress, setContractAddress] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // UI State
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserPlan(data.plan as any);
        });
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const textStr = reader.result;
        if (typeof textStr === 'string') {
          setUploadedFiles((prev) => [...prev, { name: file.name, content: textStr }]);
        }
      };
      reader.readAsText(file);
    });
    toast.success(`${acceptedFiles.length} file(s) uploaded`);
  }, []);

  const addLog = (msg: string) => setLogs((prev) => [...prev, `> ${msg}`]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([]);

    if (scanMode === 'ADDRESS' && !contractAddress.trim()) {
      toast.error('Address required');
      return;
    }
    if (scanMode === 'CODE' && !sourceCode.trim()) {
      toast.error('Code required');
      return;
    }
    if (scanMode === 'FILES' && uploadedFiles.length === 0) {
      toast.error('Files required');
      return;
    }

    setIsScanning(true);
    addLog('Initializing scanner...');

    try {
      let requestType: 'ADDRESS' | 'CODE' | 'GITHUB' | 'FILES' = scanMode;
      if (scanMode === 'ADDRESS' && (contractAddress.includes('github.com') || contractAddress.includes('github.io'))) {
        requestType = 'GITHUB';
      }

      let finalType = requestType;
      let finalContent = scanMode === 'ADDRESS' ? contractAddress : scanMode === 'CODE' ? sourceCode : 'Multi-file Upload';
      let finalScannedFiles = scanMode === 'FILES' ? uploadedFiles : undefined;

      // Pre-fetch
      if (requestType === 'GITHUB') {
        addLog(`Fetching repository: ${contractAddress}...`);
        const fetchRes = await fetch('/api/fetch/github', {
          method: 'POST',
          body: JSON.stringify({ url: contractAddress }),
        });
        const fetchData = await fetchRes.json();
        if (fetchData.files?.length > 0) {
          finalType = 'FILES';
          finalScannedFiles = fetchData.files;
          finalContent = `GitHub: ${contractAddress}`;
          addLog(`Fetched ${fetchData.files.length} contracts.`);
        }
      } else if (requestType === 'ADDRESS') {
        addLog(`Fetching contract source: ${contractAddress}...`);
        const fetchRes = await fetch('/api/fetch/contract', {
          method: 'POST',
          body: JSON.stringify({ network: 'SOLANA', address: contractAddress }),
        });
        const fetchData = await fetchRes.json();
        if (fetchData.files?.length > 0) {
          finalType = 'FILES';
          finalScannedFiles = fetchData.files;
          addLog('Verified source code found (Multi-file).');
        } else if (fetchData.sourceCode) {
          finalType = 'CODE';
          finalContent = fetchData.sourceCode;
          addLog('Verified source code found (Single-file).');
        }
      }

      addLog('Submitting scan job...');
      const response = await fetch('/api/scan/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          type: finalType,
          content: finalContent,
          scanned_files: finalScannedFiles,
          network: 'SOLANA',
          visibility // Pass visibility state
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Scan submission failed');
      }

      const { id } = await response.json();
      addLog('Scan queued successfully.');
      toast.success('Scan started in background');

      router.push(`/report/${id}`);
    } catch (error: any) {
      toast.error(error.message);
      addLog(`Error: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-72 p-4 md:p-12 overflow-y-auto pt-16 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <PageHeader title="New Scan" description="Run a security analysis on contracts, repositories, or local files" />
          </div>

          {/* Scan Interface */}
          <div
            className="rounded-xl border border-border flex flex-col gap-4 backdrop-blur-xl shadow-sm relative z-20 bg-card/40"
          >
            {/* Tab Bar */}
            <ScanTabBar scanMode={scanMode} onModeChange={setScanMode} />

            {/* Input Area */}
            <div className="p-8 min-h-[300px] flex flex-col">
              {isScanning ? (
                <ScanProgress logs={logs} />
              ) : (
                <div className="space-y-6">
                  {scanMode === 'FILES' ? (
                    <FileDropzone uploadedFiles={uploadedFiles} onDrop={onDrop} />
                  ) : (
                    <textarea
                      value={scanMode === 'ADDRESS' ? contractAddress : sourceCode}
                      onChange={(e) =>
                        scanMode === 'ADDRESS' ? setContractAddress(e.target.value) : setSourceCode(e.target.value)
                      }
                      placeholder={
                        scanMode === 'ADDRESS'
                          ? 'Mainnet Address (e.g. 7xKX...) or GitHub URL'
                          : 'Paste Program IDL or Source Code...'
                      }
                      className="bg-transparent w-full h-48 outline-none placeholder:text-muted-foreground/60 text-base md:text-lg resize-none font-light tracking-wide text-foreground font-mono"
                    />
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <TagInput
                      tags={tags}
                      tagInput={tagInput}
                      onTagInputChange={setTagInput}
                      onTagKeyDown={handleTagKeyDown}
                      onRemoveTag={removeTag}
                    />
                    <div className="h-4 w-px bg-border"></div>
                    <VisibilityDropdown visibility={visibility} userPlan={userPlan} onVisibilityChange={setVisibility} />
                    <button
                      onClick={handleScan}
                      className="px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Start Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-xs opacity-40 font-mono tracking-widest text-muted-foreground">POWERED BY AGENT YUKI</div>
        </motion.div>
      </main>
    </div>
  );
}
