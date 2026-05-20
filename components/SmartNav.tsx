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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const supabase = createClient();
    const { data } = await supabase.from('users').select('first_name').eq('user_id', userId).single();
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
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-black border-b-2 border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between w-full">

          <Link href="/" className="font-display text-xl tracking-wider text-white uppercase leading-none">
            SOR<span className="bg-ps-yellow px-0.5 text-black">7</span>ED
          </Link>

          <div className="flex items-center gap-8 text-[11px] font-display uppercase tracking-widest text-white/50">
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <Link href="/intelligence" className="hover:text-white transition-colors">Articles</Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  className="w-8 h-8 bg-ps-yellow text-black text-xs font-black flex items-center justify-center border-2 border-black hover:bg-white hover:text-black transition-colors"
                >
                  {initial}
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-1 w-44 bg-black border-2 border-white/10 overflow-hidden"
                    >
                      <Link href="/dashboard" className="flex items-center px-4 py-3 text-[11px] font-display uppercase tracking-widest text-white hover:bg-ps-yellow hover:text-black transition-colors">
                        Dashboard
                      </Link>
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-[11px] font-display uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/signup?mode=login" className="text-[11px] font-display uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/tools" className="btn-yellow text-[10px] px-5 py-2.5">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
