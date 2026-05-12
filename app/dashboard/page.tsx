"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const branches = [
  { name: "Keep Going", slug: "keep-going", icon: "🚀", color: "#3B82F6" },
  { name: "Feel Good", slug: "feel-good", icon: "🧠", color: "#A855F7" },
  { name: "Spend Smart", slug: "spend-smart", icon: "💰", color: "#10B981" },
  { name: "Be Connected", slug: "be-connected", icon: "🤝", color: "#F59E0B" },
  { name: "Plan Ahead", slug: "plan-ahead", icon: "📅", color: "#06B6D4" },
  { name: "Be Yourself", slug: "be-yourself", icon: "🌈", color: "#FB7185" },
  { name: "Level Up", slug: "level-up", icon: "⚡", color: "#6366F1" },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/signup');
        return;
      }
      
      setUser(user);

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
        
      setProfile(profileData);
      setLoading(false);
    }
    
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        
        {/* WELCOME HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-blue-400 text-xs uppercase tracking-[0.3em] font-bold mb-3">Member Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}.
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
            Everything you need to organize your life across the 7 branches is right here. 
            Your WhatsApp <span className="text-white font-mono">{profile?.whatsapp_number || 'not connected'}</span> is active.
          </p>
        </motion.div>

        {/* TOP ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 group hover:border-white/20 transition-all hover:bg-white/[0.02]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="text-2xl">📋</span>
              Assessments
            </h2>
            <p className="text-white/50 mb-6 text-sm leading-relaxed">
              Complete any assessment to see your full results immediately. 
              Identify friction points and get the right protocol.
            </p>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              View all assessments →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#111111] to-blue-900/20 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center group hover:border-white/20 transition-all">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📱</span>
            </div>
            <h2 className="text-xl font-bold mb-3">WhatsApp Protocols</h2>
            <p className="text-white/50 text-sm mb-8 leading-relaxed max-w-[240px]">
              Text keywords like <strong>BURNOUT</strong> or <strong>SLEEP</strong> for instant help.
            </p>
            <Link 
              href="/blog" 
              className="w-full bg-white text-black font-bold py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              Browse Keyword List
            </Link>
          </div>
        </div>

        {/* 7 BRANCHES GRID */}
        <div className="mb-20">
            <h2 className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold mb-8">The 7 Branches</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {branches.map((branch, i) => (
                    <motion.div
                        key={branch.slug}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link 
                            href={`/${branch.slug}`}
                            className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group aspect-square"
                        >
                            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                                {branch.icon}
                            </span>
                            <span className="text-[10px] text-center font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                {branch.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* LOGOUT OPTION */}
        <div className="mt-20 border-t border-white/10 pt-10 flex justify-between items-center">
            <p className="text-white/20 text-xs italic">
                Thank you for being part of SOR7ED.
            </p>
            <form action="/auth/signout" method="post">
                <button 
                    type="submit" 
                    className="text-white/20 hover:text-red-400 text-xs uppercase tracking-[0.2em] font-bold transition-colors"
                >
                    Sign Out
                </button>
            </form>
        </div>

      </div>
    </main>
  );
}
