interface ScanProgressProps {
  logs: string[];
}

export default function ScanProgress({ logs }: ScanProgressProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-accent border-r-accent border-b-transparent border-l-transparent animate-spin mb-4 mx-auto"></div>
        <div className="text-center font-bold text-sm mb-2 text-foreground">
          Scanning...
        </div>
      </div>
      <div
        className="w-full max-w-lg rounded-xl p-4 font-mono text-xs h-32 overflow-y-auto border border-border bg-muted/20 text-muted-foreground transition-all"
      >
        {logs.map((log, i) => (
          <div key={i} className="mb-1 opacity-80">
            {log}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </div>
  );
}
