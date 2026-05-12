type BranchIconProps = {
  branch: string;
  className?: string;
};

export default function BranchIcon({ branch, className = "w-4 h-4" }: BranchIconProps) {
  const icons = {
    'keep-going': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 14l3-3 3 3 5-5v4h4V7h-6l5 5-3-3-3 3-5-5z"/>
      </svg>
    ),
    'feel-good': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 12h3l3-9 6 18 3-9h3"/>
      </svg>
    ),
    'spend-smart': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">$</text>
      </svg>
    ),
    'be-connected': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
        <line x1="9" y1="15" x2="15" y2="9"/>
      </svg>
    ),
    'plan-ahead': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    'be-yourself': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v16z"/>
      </svg>
    ),
    'level-up': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    )
  };

  return icons[branch as keyof typeof icons] || null;
}
