'use client';

export default function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 dark:invert" />
        </div>
    );
}
