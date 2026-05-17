"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  // Close dropdown on outside click
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
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/Images/Logo2026.png" alt="SOR7ED — practical protocols for neurodivergent minds" width={240} height={96} className="h-20 w-auto" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-zinc-500 hover:text-white hover:border-white/20 transition-all group"
              aria-label="Search (⌘K)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm hidden sm:block">Search</span>
              <kbd className="hidden lg:flex items-center gap-0.5 text-xs text-zinc-700 group-hover:text-zinc-500 transition-colors font-mono">⌘K</kbd>
            </button>

            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:border-white/25 transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-white text-black text-xs font-black flex items-center justify-center shrink-0">
                    {initial}
                  </span>
                  <span className="text-sm text-white/70 hidden sm:block max-w-[100px] truncate">
                    {profile?.first_name ?? 'Account'}
                  </span>
                  <svg className={`w-3 h-3 text-white/30 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs font-black text-white truncate">{profile?.first_name ?? 'Account'}</p>
                        <p className="text-[10px] text-white/30 truncate mt-0.5">{user.email}</p>
                      </div>

                      {[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Settings', href: '/dashboard?tab=settings' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-white/5">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all"
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
                className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
