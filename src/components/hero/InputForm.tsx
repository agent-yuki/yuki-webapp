import { useState } from 'react';
import { Globe, Lock, Upload, Play, ChevronDown } from 'lucide-react';

const InputForm: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="max-w-4xl mx-auto p-4 rounded-xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col gap-4 text-card-foreground"
    >
      <div className="w-full">
        <textarea
          placeholder="Enter your smart contract code, contract address or GitHub repository"
          className="bg-transparent w-full h-24 outline-none placeholder:text-muted-foreground text-base md:text-lg resize-none font-light tracking-wide text-foreground"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full relative z-20 gap-4">
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between md:justify-start gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-xs font-medium whitespace-nowrap transition-colors hover:bg-secondary text-foreground w-full md:w-auto"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>Public</span>
            </div>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute top-full mt-2 left-0 w-full md:w-48 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50 p-1"
            >
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors hover:bg-accent hover:text-accent-foreground text-foreground"
              >
                <Globe className="w-3 h-3" /> Public
              </button>
              <button
                disabled
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground cursor-not-allowed rounded-lg flex items-center gap-2 justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Private
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted">PRO</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2 rounded-lg font-semibold text-sm transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center gap-2">
            <Upload className="w-3 h-3" />
            Upload Code
          </button>

          <button
            className="flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-colors bg-accent text-accent-foreground hover:bg-accent/90 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Start</span>
            <span className="text-[10px] opacity-60 ml-1 font-mono hidden md:inline-block">Ctrl + ↵</span>
            <Play className="w-3 h-3 fill-current ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;