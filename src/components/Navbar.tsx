import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import SearchModal from './SearchModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Github, Twitter } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const { colors } = useTheme(); // Keeping this for now if Context still relies on it, but we should prefer CSS vars
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter text-accent">YUKI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/whitepaper" className="hover:text-foreground transition-colors">Whitepaper</Link>

              <div className="relative group cursor-pointer hover:text-foreground transition-colors">
                <div className="flex items-center gap-1 py-4">
                  Community <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </div>

                <div
                  className="absolute top-full left-0 w-48 rounded-xl border border-border bg-popover p-1 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    X (Twitter)
                  </a>
                </div>
              </div>

              <div className="relative group cursor-pointer hover:text-foreground transition-colors">
                <div className="flex items-center gap-1">
                  Resources <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-input bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-64 justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  {user.email?.[0].toUpperCase()}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-border bg-popover shadow-lg z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border bg-muted/40">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold truncate pr-2 text-foreground">
                              {user.user_metadata?.full_name || 'User'}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-border bg-background text-muted-foreground uppercase">
                              {user.app_metadata?.plan || 'FREE'}
                            </span>
                          </div>
                          <div className="text-xs truncate text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                        <div className="p-1">
                          {['Dashboard', 'Profile', 'Billing'].map((item) => (
                            <Link
                              key={item}
                              href={`/${item.toLowerCase()}`}
                              className="block px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                        <div className="h-px bg-border mx-1" />
                        <div className="p-1">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              signOut();
                            }}
                            className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-border bg-background overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/whitepaper" onClick={() => setIsMobileMenuOpen(false)}>Whitepaper</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
