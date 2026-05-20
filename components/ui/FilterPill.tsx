"use client";

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export default function FilterPill({ label, isActive, onClick, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 inline-flex items-center gap-2
        px-5 py-2
        text-[11px] font-sans font-medium uppercase tracking-[0.1em]
        rounded-full transition-all duration-200 active:scale-95
        ${isActive
          ? 'bg-black text-white shadow-sm'
          : 'bg-gray-100 text-black/60 hover:bg-gray-200'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] font-sans px-1 ${isActive ? 'text-white/60' : 'text-black/40'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
