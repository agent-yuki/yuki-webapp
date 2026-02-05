import { useState } from 'react';
import { Globe, Lock, ChevronDown } from 'lucide-react';

type Visibility = 'PUBLIC' | 'PRIVATE';

interface VisibilityDropdownProps {
  visibility: Visibility;
  userPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
  onVisibilityChange: (visibility: Visibility) => void;
}

export default function VisibilityDropdown({
  visibility,
  userPlan,
  onVisibilityChange,
}: VisibilityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all text-foreground bg-secondary/50 border border-border hover:bg-secondary"
      >
        {visibility === 'PUBLIC' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
        {visibility}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 rounded-lg overflow-hidden z-50 bg-popover border border-border shadow-lg animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => {
              onVisibilityChange('PUBLIC');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 hover:bg-muted ${visibility === 'PUBLIC' ? 'bg-accent/10 text-accent' : 'text-foreground'
              }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public
          </button>
          <button
            onClick={() => {
              if (userPlan !== 'FREE') {
                onVisibilityChange('PRIVATE');
                setIsOpen(false);
              }
            }}
            className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 justify-between transition-colors hover:bg-muted ${userPlan === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''
              } ${visibility === 'PRIVATE' ? 'bg-accent/10 text-accent' : 'text-foreground'}`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Private
            </div>
            {userPlan === 'FREE' && (
              <span className="text-[10px]">
                <Lock className="w-3 h-3" />
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
