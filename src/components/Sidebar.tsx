import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  FileText,
  User,
  CreditCard,
  Key,
  LogOut,
  ChevronDown,
  MoreVertical,
  Sidebar as SidebarIcon
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(true);

  // Real Data State
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState('FREE');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('plan, credits').eq('id', user.id).maybeSingle();
        if (data) {
          setPlan(data.plan || 'FREE');
          setCredits(data.credits || 0);
        } else {
          const { data: newProfile } = await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'User',
            credits: 3
          }, { onConflict: 'id' }).select().single();

          if (newProfile) {
            setPlan(newProfile.plan || 'FREE');
            setCredits(newProfile.credits ?? 3);
          }
        }
      };
      fetchProfile();
    }
  }, [user]);

  const isActive = (path: string) => pathname === path;

  /* Mobile Toggle */
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on path change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const NavItem = ({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string, onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
        isActive(href)
          ? "font-bold bg-accent/10 text-accent shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <Icon className={cn("w-5 h-5 z-10", isActive(href) ? "text-accent" : "")} />
      <span className="relative z-10">{label}</span>
      {isActive(href) && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-accent" />
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-background border border-border shadow-sm"
      >
        <SidebarIcon className="w-5 h-5 text-foreground" />
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 flex flex-col border-r border-border bg-background/95 backdrop-blur z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* 1. Logo Section */}
        <div className="p-8 pb-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-3xl font-bold tracking-tighter text-accent">YUKI</div>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold border border-border bg-secondary text-muted-foreground uppercase tracking-widest">Beta</div>
          </Link>
          {/* Close button for mobile */}
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="px-4 text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground/60">Main</div>

          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/scan" icon={ScanLine} label="New Scan" />

          {/* Reports Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl group hover:bg-muted/50 transition-all text-left text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Reports</span>
              </div>
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isReportsOpen ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
              {isReportsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 space-y-1 mt-1 mb-2">
                    {[
                      { href: '/reports/mine', label: 'My Reports' },
                      { href: '/reports/public', label: 'Public Reports' }
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                          isActive(item.href)
                            ? "text-accent-foreground font-medium bg-accent/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full opacity-50", isActive(item.href) ? "bg-accent" : "bg-currentColor")} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavItem href="/profile" icon={User} label="Profile" />
          <NavItem href="/billing" icon={CreditCard} label="Billing" />
          <NavItem href="/api-keys" icon={Key} label="API Keys" />
        </nav>

        {/* 3. User & Plan Section */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="rounded-xl p-4 mb-4 relative overflow-hidden bg-muted/30 border border-border/50">
            <div className="relative z-10 flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-muted-foreground">Current Plan</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent text-accent-foreground">
                {plan}
              </span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(5, (credits / (plan === 'FREE' ? 3 : 50)) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[10px] mt-2 text-muted-foreground flex justify-between">
              <span>{credits} Credits Left</span>
              <Link href="/billing" className="hover:underline hover:text-foreground">Upgrade</Link>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm bg-accent text-accent-foreground">
                {user?.email?.[0].toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate text-foreground">
                  {user?.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-xs truncate text-muted-foreground/70">
                  {user?.email}
                </div>
              </div>

              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Popup Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 rounded-xl border border-border bg-popover shadow-xl overflow-hidden p-1 z-50"
                >
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
