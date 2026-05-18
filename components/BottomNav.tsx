"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, BookOpen, User } from 'lucide-react';

const NAV = [
  { href: '/',             label: 'Home',   Icon: Home     },
  { href: '/tools',        label: 'Tools',  Icon: Compass  },
  { href: '/intelligence', label: 'Reads',  Icon: BookOpen },
  { href: '/dashboard',    label: 'Account',Icon: User     },
];

export default function BottomNav() {
  const pathname = usePathname();
  const hidden = ['/signup', '/auth', '/bridge'].some(p => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-black pb-safe">
      <div className="flex items-center justify-around px-2 py-2.5">
        {NAV.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 active:scale-95 transition-transform"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-black' : 'text-black/25'}
              />
              <span className={`text-[9px] font-display uppercase tracking-widest leading-none ${isActive ? 'text-black font-black' : 'text-black/25'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
