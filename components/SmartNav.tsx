"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import GlobalSearch from '@/components/GlobalSearch';

export default function SmartNav() {
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/Images/Logo2026.png" alt="SOR7ED" width={240} height={96} className="h-20 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/tools" className="text-white/60 hover:text-white transition-colors">
              Assessments
            </Link>
            <Link href="/intelligence" className="text-white/60 hover:text-white transition-colors">
              Articles
            </Link>
          </div>

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

            <Link
              href={user ? "/dashboard" : "/signup"}
              className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-all shadow-lg"
            >
              {user ? "Dashboard" : "Sign Up"}
            </Link>
          </div>
        </div>
      </motion.nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
