import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (index: number) => void;
}

export default function TagInput({
  tags,
  tagInput,
  onTagInputChange,
  onTagKeyDown,
  onRemoveTag,
}: TagInputProps) {
  return (
    <div className="flex-1 flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border animate-in fade-in zoom-in duration-200 border-accent/20 bg-accent/10 text-accent"
        >
          {tag}
          <button onClick={() => onRemoveTag(i)} className="hover:opacity-100 opacity-60 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={tagInput}
        onChange={(e) => onTagInputChange(e.target.value)}
        onKeyDown={onTagKeyDown}
        placeholder={tags.length === 0 ? 'Add tags (e.g. Audit, V1)...' : ''}
        className="bg-transparent outline-none text-xs font-medium placeholder:text-muted-foreground/40 min-w-[60px] flex-1 py-1 text-foreground"
      />
    </div>
  );
}
