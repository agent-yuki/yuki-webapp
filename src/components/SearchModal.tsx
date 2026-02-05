import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_NETWORKS = [
  { id: 'ETHEREUM', icon: '⟠' },
  { id: 'SOLANA', icon: '◎' },
  { id: 'AVAX', icon: '🔺' },
  { id: 'BSC', icon: '🔶' },
  { id: 'POLYGON', icon: '💜' },
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    // Reset on open
    setQuery('');
    setResults([]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const STATIC_PAGES = [
    { id: 'home', title: 'Home', path: '/', category: 'Page' },
    { id: 'docs', title: 'Developer Documentation', path: '/docs', category: 'Resource' },
    { id: 'pricing', title: 'Pricing & Plans', path: '/pricing', category: 'Page' },
    { id: 'about', title: 'About Us', path: '/about', category: 'Page' },
    { id: 'whitepaper', title: 'Whitepaper', path: '/whitepaper', category: 'Resource' },
    { id: 'docs-auth', title: 'Docs: Authentication', path: '/docs#authentication', category: 'Section' },
    { id: 'docs-sdk', title: 'Docs: SDK Usage', path: '/docs#sdk', category: 'Section' },
    { id: 'docs-api', title: 'Docs: API Reference', path: '/docs#api', category: 'Section' },
  ];



  useEffect(() => {
    const searchIncidents = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // 1. Search Static Pages
        const staticResults = STATIC_PAGES.filter(page =>
          page.title.toLowerCase().includes(query.toLowerCase())
        ).map(page => ({
          id: page.id,
          title: page.title,
          path: page.path,
          type: 'static',
          network: page.category
        }));

        // 2. Search Supabase (Database)
        let dbResults: any[] = [];
        const { data } = await supabase
          .from('security_incidents')
          .select('id, title, contract_address, network, score, severity')
          .or(`title.ilike.%${query}%,contract_address.ilike.%${query}%`)
          .limit(5);

        if (data) dbResults = data.map((item: any) => ({ ...item, type: 'incident', path: `/report/${item.id}` }));

        setResults([...staticResults, ...dbResults]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchIncidents, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (item: any) => {
    if (item.path) {
      router.push(item.path);
    } else {
      router.push(`/report/${item.id}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: colors.cardBg, borderColor: colors.borderDark, borderWidth: 1 }}
      >
        <div className="flex items-center px-4 border-b" style={{ borderColor: colors.borderDark }}>
          <svg className="w-5 h-5 opacity-50 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textPrimary }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts by address or name..."
            className="w-full py-4 bg-transparent outline-none text-lg placeholder-gray-500"
            style={{ color: colors.textPrimary }}
          />
          <div className="px-2 py-1 text-xs rounded border ml-2 font-mono opacity-70" style={{ borderColor: colors.borderDark, color: colors.textSecondary }}>
            ESC
          </div>
        </div>

        <div className="p-2">
          {query ? (
            <>
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-50" style={{ color: colors.textSecondary }}>
                Search Results
              </div>

              {loading ? (
                <div className="p-4 text-center text-sm opacity-50" style={{ color: colors.textSecondary }}>Searching...</div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors"
                      style={{ color: colors.textPrimary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryBg}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-80 w-6 text-center" title={item.network}>
                          {item.type === 'static' ? '📄' : (SUPPORTED_NETWORKS.find(n => n.id === item.network)?.icon || '🌐')}
                        </span>
                        <div>
                          <div className="text-sm font-bold">{item.contract_address || item.title}</div>
                          {item.type === 'incident' && (
                            <div className="text-xs opacity-60" style={{ color: colors.textSecondary }}>{item.title}</div>
                          )}
                          {item.type === 'static' && (
                            <div className="text-xs opacity-60" style={{ color: colors.textSecondary }}>{item.path}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.score && (
                          <span className={`text-sm font-bold ${item.score >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {item.score}/100
                          </span>
                        )}
                        {item.severity && (
                          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${item.severity === 'High' ? 'border-red-500 text-red-500' : 'border-gray-500 text-gray-500'
                            }`}>
                            {item.severity}
                          </span>
                        )}
                        {item.type === 'static' && (
                          <span className="text-[10px] px-2 py-0.5 rounded border border-gray-500 text-gray-500 uppercase">
                            GUIDE
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm opacity-50" style={{ color: colors.textSecondary }}>No results found.</div>
              )}
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-50" style={{ color: colors.textSecondary }}>
                Suggested
              </div>
              <div className="space-y-1">
                {['Platform Overview', 'Documentation', 'API Reference', 'Latest Incidents'].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center px-3 py-3 rounded-lg cursor-pointer transition-colors"
                    style={{ color: colors.textPrimary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg className="w-4 h-4 mr-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2 border-t text-xs flex items-center justify-end"
          style={{ borderColor: colors.borderDark, backgroundColor: colors.secondaryBg, color: colors.textSecondary }}
        >
          <span>Agent Yuki Intelligent Search</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
