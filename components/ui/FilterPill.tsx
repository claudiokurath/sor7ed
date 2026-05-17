"use client";

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-4 py-1.5 rounded-full
        text-[10px] font-bold uppercase tracking-widest
        border transition-all duration-200 active:scale-95
        ${isActive
          ? 'bg-brand-amber text-surface-bg border-brand-amber'
          : 'bg-transparent text-text-secondary border-surface-border hover:border-text-muted'
        }
      `}
    >
      {label}
    </button>
  );
}
