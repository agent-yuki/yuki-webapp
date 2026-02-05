type ScanMode = 'ADDRESS' | 'CODE' | 'FILES';

interface ScanTabBarProps {
  scanMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
}

export default function ScanTabBar({ scanMode, onModeChange }: ScanTabBarProps) {
  return (
    <div className="flex border-b border-border">
      {(['ADDRESS', 'CODE', 'FILES'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`flex-1 py-4 text-xs font-bold tracking-widest transition-all border-b-2 ${scanMode === mode
              ? 'border-accent text-accent bg-accent/5'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
        >
          {mode === 'ADDRESS' ? 'ADDRESS / URL' : mode}
        </button>
      ))}
    </div>
  );
}
