'use client';

export default function ContentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#0f0f0f] rounded-lg border border-[#222] overflow-hidden animate-pulse">
          <div className="p-4 border-b border-[#222] space-y-2">
            <div className="h-4 bg-[#222] rounded w-3/4"></div>
            <div className="h-3 bg-[#222] rounded w-1/4"></div>
          </div>
          <div className="p-4 space-y-2">
            <div className="h-3 bg-[#222] rounded w-full"></div>
            <div className="h-3 bg-[#222] rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
