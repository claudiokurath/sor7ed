"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import GlobalSearch from '@/components/GlobalSearch';

type Profile = { first_name: string | null };

export default function SmartNav() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('first_name')
      .eq('user_id', userId)
      .single();
    if (data) setProfile(data);
  }

  const initial = profile?.first_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?';

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop only — hidden on mobile (BottomNav handles mobile) */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-surface-glass backdrop-blur-xl border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">

          <Link href="/" className="font-display text-xl tracking-wider text-text-primary uppercase leading-none">
            SOR7ED
          </Link>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
            <Link href="/tools" className="hover:text-text-primary transition-colors">Tools</Link>
            <Link href="/intelligence" className="hover:text-text-primary transition-colors">Intelligence</Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 border border-surface-border bg-surface-elevated px-3 py-1.5 text-text-muted hover:border-text-muted hover:text-text-primary transition-all rounded-lg"
              aria-label="Search (⌘K)"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
              <kbd className="text-[10px] text-text-muted font-mono">⌘K</kbd>
            </button>

            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 border border-surface-border bg-surface-elevated px-3 py-1.5 hover:border-brand-amber transition-all rounded-lg"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-amber text-surface-bg text-[10px] font-black flex items-center justify-center shrink-0">
                    {initial}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary hidden sm:block max-w-[80px] truncate">
                    {profile?.first_name ?? 'Account'}
                  </span>
                  <svg className={`w-3 h-3 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-1 w-48 bg-surface-elevated border border-surface-border shadow-card rounded-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-surface-border">
                        <p className="text-[10px] font-black text-text-primary truncate uppercase tracking-widest">{profile?.first_name ?? 'Account'}</p>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">{user.email}</p>
                      </div>

                      {[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Settings',  href: '/dashboard?tab=settings' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-surface-bg hover:text-text-primary transition-all"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-surface-border">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-ps-danger hover:bg-ps-danger hover:text-white transition-all"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/signup"
                className="btn-primary text-[10px] px-5 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
