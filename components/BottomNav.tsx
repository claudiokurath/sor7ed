"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, BookOpen, User } from 'lucide-react';

const NAV = [
  { href: '/',             label: 'Home',   Icon: Home     },
  { href: '/tools',        label: 'Tools',  Icon: Compass  },
  { href: '/intelligence', label: 'Articles',  Icon: BookOpen },
  { href: '/dashboard',    label: 'Account',Icon: User     },
];

export default function BottomNav() {
  const pathname = usePathname();
  const hidden = ['/signup', '/auth', '/bridge', '/statement'].some(p => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-ps-black/80 backdrop-blur-md border-t border-ps-white/10 pb-safe safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1.5 px-4 py-2.5 min-h-[48px] min-w-[64px] active:scale-95 transition-transform"
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-teal-400' : 'text-ps-gray-500'}
              />
              <span className={`text-[8px] font-mono uppercase tracking-[0.15em] leading-none ${isActive ? 'text-teal-400 font-bold' : 'text-ps-gray-500'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
