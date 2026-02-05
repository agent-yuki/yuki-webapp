'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check local storage after mount to avoid hydration mismatch
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Small delay for better UX (don't pop immediately)
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('cookie_consent', 'all');
        setShow(false);
    };

    const acceptNecessary = () => {
        localStorage.setItem('cookie_consent', 'necessary');
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="fixed bottom-4 right-4 z-[100] w-[90vw] max-w-sm rounded-xl border border-border bg-popover p-5 shadow-2xl md:bottom-6 md:right-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                <Cookie className="h-4 w-4" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold leading-none text-foreground">Cookie Policy</h3>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <button
                            onClick={acceptAll}
                            className="flex-1 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={acceptNecessary}
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted/50"
                        >
                            Necessary Only
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
