"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { branches } from '@/lib/constants';
import KeywordToken from '@/components/KeywordToken';
import { getBranchColor } from '@/lib/branch-config';
import { ScoreLevel } from '@/types/assessment';

type UserFavorite = {
  id: string;
  item_type: 'tool' | 'protocol';
  item_slug: string;
  item_name: string;
  item_keyword: string;
  item_color: string;
  item_branch: string;
  saved_at: string;
};

type AssessmentHistory = {
  id: string;
  tool_slug: string;
  tool_name: string;
  score: number;
  level: ScoreLevel;
  completed_at: string;
};

const supabase = createClient();

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [history, setHistory] = useState<AssessmentHistory[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'overview' | 'saved' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          if (mounted) router.replace('/signup?mode=login');
          return;
        }

        const currentUser = session.user;
        if (mounted) setUser(currentUser);

        const [profileRes, favoritesRes, historyRes, toolsRes] = await Promise.all([
          supabase.from('users').select('*').eq('email', currentUser.email).single(),
          supabase.from('user_favorites').select('*').order('saved_at', { ascending: false }),
          supabase.from('assessment_history').select('*').order('completed_at', { ascending: false }).limit(20),
          supabase.from('tools').select('slug, branch, color')
        ]);

        if (mounted) {
          setProfile(profileRes.data);
          setFavorites(favoritesRes.data || []);
          setHistory(historyRes.data || []);
          setTools(toolsRes.data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        if (mounted) router.replace('/signup?mode=login');
      }
    }

    loadDashboard();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) router.replace('/signup?mode=login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const branchCoverage = useMemo(() => {
    const assessedBranches = new Set(history.map(h => {
        // Find branch from tools table
        const tool = tools.find(t => t.slug === h.tool_slug);
        return tool?.branch?.toLowerCase().replace(/\s+/g, '-');
    }).filter(Boolean));

    return branches.map(b => ({
      ...b,
      isAssessed: assessedBranches.has(b.slug)
    }));
  }, [history, tools]);

  const removeFavorite = async (id: string) => {
    await supabase.from('user_favorites').delete().eq('id', id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-10 h-10 border-2 border-white/5 border-t-white/40 rounded-full"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* Premium Noir Header */}
      <div className="border-b border-white/5 px-6 sm:px-12 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Link href="/" className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-bold hover:text-white/40 transition-colors">
                    SOR7ED
                </Link>
                <span className="text-white/10">/</span>
                <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">INTELLIGENCE PROFILE</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
                {profile?.first_name ? `${profile.first_name}` : 'Archive'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/30">
                <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white/50">
                    ID: {profile?.whatsapp_number || 'PENDING'}
                </span>
                <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white/50">
                    STATUS: ACTIVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/tools"
                className="bg-white text-black px-8 py-4 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95"
              >
                + NEW ASSESSMENT
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-all group"
                >
                  <span className="sr-only">Sign Out</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/30 group-hover:text-white transition-colors">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Section Navigation */}
          <nav className="flex gap-8 mt-16 border-b border-white/5">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'saved', label: 'Library' },
              { key: 'history', label: 'History' }
            ].map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as any)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeSection === section.key
                    ? 'text-white'
                    : 'text-white/20 hover:text-white/40'
                }`}
              >
                {section.label}
                {activeSection === section.key && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" 
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        <AnimatePresence mode="wait">

          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Branch Coverage Visualization */}
              <div className="lg:col-span-2 space-y-12">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Branch Coverage</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                        {branchCoverage.map((branch, i) => (
                            <motion.div 
                                key={branch.slug}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={`aspect-square rounded-3xl p-6 flex flex-col justify-between border transition-all duration-500 ${
                                    branch.isAssessed 
                                        ? 'bg-[#0f0f0f] border-white/10' 
                                        : 'bg-transparent border-white/5 grayscale opacity-30'
                                }`}
                            >
                                <span className="text-2xl">{branch.icon}</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: branch.isAssessed ? branch.color : 'inherit' }}>
                                        {branch.name}
                                    </p>
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                                        {branch.isAssessed ? 'CALIBRATED' : 'UNTOUCHED'}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        <div className="aspect-square rounded-3xl p-6 flex flex-col items-center justify-center border border-dashed border-white/10 opacity-20">
                            <span className="text-xl font-black">+</span>
                        </div>
                    </div>
                </section>

                {/* Intelligence Feed (Recent History) */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Intelligence Feed</h2>
                        <button 
                            onClick={() => setActiveSection('history')}
                            className="text-[10px] font-bold text-white/20 hover:text-white transition-colors"
                        >
                            VIEW ALL →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl">
                                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No transmissions recorded.</p>
                            </div>
                        ) : (
                            history.slice(0, 3).map((item) => (
                                <div 
                                    key={item.id} 
                                    className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div 
                                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-sm font-black"
                                            style={{ color: getBranchColor(favorites.find(f => f.item_slug === item.tool_slug)?.item_branch || '') }}
                                        >
                                            {item.score}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base group-hover:text-white/90 transition-colors">{item.tool_name}</h3>
                                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">
                                                {new Date(item.completed_at).toLocaleDateString()} · {item.level?.toUpperCase() || 'CALIBRATED'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/tools/${item.tool_slug}`}
                                        className="text-white/20 group-hover:text-white transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </section>
              </div>

              {/* Sidebar Stats & Keywords */}
              <div className="space-y-12">
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">System Stats</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Saved Protocols', value: favorites.length, color: '#fff' },
                            { label: 'Assessments', value: history.length, color: '#fff' },
                            { label: 'Coverage', value: `${Math.round((branchCoverage.filter(b => b.isAssessed).length / 7) * 100)}%`, color: '#fff' }
                        ].map((stat) => (
                            <div key={stat.label} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</span>
                                <span className="text-xl font-black">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Active Keywords</h2>
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8">
                        {favorites.length === 0 ? (
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center py-4">No active keywords.</p>
                        ) : (
                            <div className="space-y-6">
                                {favorites.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4">
                                        <KeywordToken 
                                            keyword={item.item_keyword} 
                                            color={item.item_color} 
                                            size="small" 
                                        />
                                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter truncate max-w-[100px]">
                                            {item.item_name}
                                        </span>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setActiveSection('saved')}
                                    className="w-full text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors mt-4"
                                >
                                    VIEW ALL →
                                </button>
                            </div>
                        )}
                    </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* SAVED ITEMS SECTION */}
          {activeSection === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {favorites.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px]">
                  <div className="text-4xl mb-8">🔖</div>
                  <h3 className="text-2xl font-black mb-4">Library Empty</h3>
                  <p className="text-white/30 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
                    Build your intelligence archive by saving tools and protocols.
                  </p>
                  <Link
                    href="/tools"
                    className="inline-block bg-white text-black font-black px-10 py-5 rounded-full hover:scale-105 transition-all"
                  >
                    INITIATE DISCOVERY →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 group transition-all hover:border-white/10"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <KeywordToken 
                                    keyword={item.item_keyword} 
                                    color={item.item_color} 
                                    size="medium" 
                                />
                                <button
                                    onClick={() => removeFavorite(item.id)}
                                    className="p-3 rounded-full hover:bg-red-500/10 text-white/10 hover:text-red-500 transition-all"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{item.item_name}</h3>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                {item.item_branch} · {item.item_type}
                            </p>

                            <Link
                                href={item.item_type === 'tool' ? `/tools/${item.item_slug}` : `/blog/${item.item_slug}`}
                                className="block w-full text-center py-4 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                {item.item_type === 'tool' ? 'RETAKE ASSESSMENT' : 'READ PROTOCOL'}
                            </Link>
                        </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* HISTORY SECTION */}
          {activeSection === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Transmission History</h2>
                <span className="text-[10px] font-bold text-white/20 uppercase">Showing {history.length} events</span>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px]">
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No transmissions recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-8">
                                <div className="text-center shrink-0">
                                    <p className="text-2xl font-black mb-1">{item.score}</p>
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">SCORE</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-white transition-colors">{item.tool_name}</h3>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-2">
                                        {new Date(item.completed_at).toLocaleDateString()} · {item.level?.toUpperCase() || 'CALIBRATED'}
                                    </p>
                                </div>
                            </div>
                            <Link 
                                href={`/tools/${item.tool_slug}`}
                                className="px-6 py-3 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white hover:text-black hover:border-white transition-all text-center"
                            >
                                VIEW REPORT →
                            </Link>
                        </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
