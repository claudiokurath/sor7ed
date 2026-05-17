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
        px-4 py-2
        text-[10px] font-display uppercase tracking-[0.15em]
        border-2 transition-all duration-150 active:scale-95
        ${isActive
          ? 'bg-ps-yellow text-ps-black border-ps-yellow shadow-hard-white'
          : 'bg-ps-black text-ps-white border-ps-white hover:border-ps-yellow hover:text-ps-yellow'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[9px] font-display px-1 ${isActive ? 'text-ps-black/60' : 'text-ps-white/40'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
