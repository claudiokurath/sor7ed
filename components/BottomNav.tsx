"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, BookOpen, User } from 'lucide-react';

const NAV = [
  { href: '/',             label: 'HOME',    Icon: Home     },
  { href: '/tools',        label: 'TOOLS',   Icon: Compass  },
  { href: '/intelligence', label: 'READS',   Icon: BookOpen },
  { href: '/dashboard',    label: 'ACCOUNT', Icon: User     },
];

export default function BottomNav() {
  const pathname = usePathname();

  const hidden = ['/signup', '/auth', '/bridge'].some(p => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-ps-black border-t-2 border-ps-white pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {NAV.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 active:scale-95 transition-transform"
            >
              <div className={`w-9 h-9 flex items-center justify-center transition-all duration-200 ${
                isActive ? 'bg-ps-yellow text-ps-black' : 'bg-transparent text-ps-white'
              }`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-display uppercase tracking-widest leading-none ${
                isActive ? 'text-ps-yellow' : 'text-ps-white/50'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
