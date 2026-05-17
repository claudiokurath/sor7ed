"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, BookOpen, User } from 'lucide-react';

const NAV = [
  { href: '/',             label: 'HOME',   Icon: Home     },
  { href: '/tools',        label: 'TOOLS',  Icon: Compass  },
  { href: '/intelligence', label: 'INTEL',  Icon: BookOpen },
  { href: '/dashboard',    label: 'ACCOUNT', Icon: User   },
];

export default function BottomNav() {
  const pathname = usePathname();

  const hidden = ['/signup', '/auth', '/bridge'].some(p => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-glass backdrop-blur-xl border-t border-surface-border pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {NAV.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl active:scale-95 transition-transform"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-brand-amber' : 'text-text-muted'}
              />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-amber' : 'text-text-muted'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
