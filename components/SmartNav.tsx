"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function SmartNav() {
  const [user, setUser] = useState<User | null>(null);

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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10"
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

        <Link
          href={user ? "/dashboard" : "/signup"}
          className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-all shadow-lg"
        >
          {user ? "Dashboard" : "Sign Up"}
        </Link>
      </div>
    </motion.nav>
  );
}
