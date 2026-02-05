
export const LanguageIcon = ({ language, color }: { language?: string, color?: string }) => {
    const lang = (language || 'Unknown').toLowerCase();
    const style = { stroke: color || 'currentColor' };

    if (lang.includes('solidity')) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
                <path d="m12 2-8 12 8 8 8-8-8-12Z" /><path d="m4 14 8-2 8 2" />
            </svg>
        );
    }
    if (lang.includes('rust')) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v12" /><path d="M8 12h8" />
                <path d="m9 9 6 6" /><path d="m15 9-6 6" />
            </svg>
        );
    }
    if (lang.includes('vyper')) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
                <path d="m12 2 8 6v8l-8 6-8-6V8l8-6Z" />
                <path d="M12 10v4" />
            </svg>
        );
    }
    if (lang.includes('move')) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12 4 4 4-4" /><path d="M12 8v8" />
            </svg>
        );
    }

    // Unknown / Default
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M3 21l18-18" /><path d="M3 3l18 18" />
        </svg>
    );
};
