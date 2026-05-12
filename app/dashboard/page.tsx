"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}.
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Your WhatsApp number <span className="text-white font-mono">{profile?.whatsapp_number || 'not connected'}</span> is connected. 
            Text any keyword to receive protocols instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 group hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4">Your Assessments</h2>
            <p className="text-white/50 mb-6 text-sm leading-relaxed">
              Complete any assessment to see your full results immediately. 
              Our tools are designed to help you identify friction points in your daily life.
            </p>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              View all 7 assessments →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#111111] to-blue-900/20 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h2 className="text-xl font-bold mb-3">WhatsApp Ready</h2>
            <p className="text-white/50 text-sm mb-8 leading-relaxed max-w-[240px]">
              Text keywords like <strong>BURNOUT</strong>, <strong>SLEEP</strong>, or <strong>FRICTION</strong> to get instant protocols.
            </p>
            <Link 
              href="/blog" 
              className="w-full bg-white text-black font-bold py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              Find Keywords
            </Link>
          </div>
        </div>

        {/* LOGOUT OPTION */}
        <div className="mt-20 border-t border-white/10 pt-10 text-center">
            <form action="/auth/signout" method="post">
                <button 
                    type="submit" 
                    className="text-white/20 hover:text-red-400 text-xs uppercase tracking-[0.2em] font-bold transition-colors"
                >
                    Sign Out of SOR7ED
                </button>
            </form>
        </div>

      </div>
    </main>
  );
}
