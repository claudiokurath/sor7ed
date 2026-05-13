"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import BranchIcon from '@/components/BranchIcon';
import KeywordToken from '@/components/KeywordToken';

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
  completed_at: string;
};

const supabase = createClient();

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [history, setHistory] = useState<AssessmentHistory[]>([]);
  const [activeSection, setActiveSection] = useState<'overview' | 'saved' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        // CRITICAL: Check session first for speed/reliability
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.log('No active session, redirecting to signin');
          if (mounted) router.replace('/signup?mode=login');
          return;
        }

        const currentUser = session.user;
        if (mounted) setUser(currentUser);

        // Load all member data in parallel
        const [profileRes, favoritesRes, historyRes] = await Promise.all([
          supabase.from('users').select('*').eq('email', currentUser.email).single(),
          supabase.from('user_favorites').select('*').order('saved_at', { ascending: false }),
          supabase.from('assessment_history').select('*').order('completed_at', { ascending: false }).limit(10)
        ]);

        if (mounted) {
          setProfile(profileRes.data);
          setFavorites(favoritesRes.data || []);
          setHistory(historyRes.data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        if (mounted) router.replace('/signup?mode=login');
      }
    }

    loadDashboard();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) router.replace('/signup?mode=login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const removeFavorite = async (id: string) => {
    await supabase.from('user_favorites').delete().eq('id', id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full"
        />
      </main>
    );
  }

  const savedTools = favorites.filter(f => f.item_type === 'tool');
  const savedProtocols = favorites.filter(f => f.item_type === 'protocol');

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      
      {/* Mobile-First Header */}
      <div className="border-b border-white/10 px-4 sm:px-6 md:px-16 py-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-4">
            ← Back to SOR7ED
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {profile?.first_name ? `Hey, ${profile.first_name}` : 'Your Dashboard'}
              </h1>
              <p className="text-white/50 mt-2">
                WhatsApp ready: <span className="font-mono text-white/70">{profile?.whatsapp_number}</span>
              </p>
            </div>
            <form action="/auth/signout" method="post">
                <button
                type="submit"
                className="text-white/30 hover:text-white text-sm transition-colors border border-white/10 px-4 py-2 rounded-full hover:border-white/30 self-start sm:self-auto"
                >
                Sign Out
                </button>
            </form>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'saved', label: `Saved (${favorites.length})` },
              { key: 'history', label: 'History' }
            ].map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.key
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16 py-12">
        <AnimatePresence mode="wait">

          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Saved Items', value: favorites.length, color: '#3B82F6' },
                  { label: 'Assessments', value: history.length, color: '#A855F7' },
                  { label: 'Keywords Ready', value: favorites.length, color: '#10B981' },
                  { label: 'Branches Explored', value: new Set(favorites.map(f => f.item_branch)).size, color: '#F59E0B' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#111111] border border-white/10 rounded-2xl p-6"
                  >
                    <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Keywords Panel */}
              <div className="bg-[#111111] border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-2">Your WhatsApp Keywords</h2>
                <p className="text-white/50 text-sm mb-6">
                  Text any of these to your SOR7ED WhatsApp number for instant protocols.
                </p>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/30 mb-4">No saved keywords yet.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/tools" className="text-white underline text-sm">
                        Try an assessment →
                      </Link>
                      <Link href="/blog" className="text-white underline text-sm">
                        Browse articles →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/50 border border-white/10 rounded-2xl p-4 text-center"
                        style={{ borderColor: `${item.item_color}30` }}
                      >
                        <p 
                          className="font-mono font-bold text-lg tracking-widest mb-2"
                          style={{ color: item.item_color }}
                        >
                          {item.item_keyword}
                        </p>
                        <p className="text-white/40 text-xs">{item.item_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/tools"
                  className="group bg-gradient-to-br from-[#111111] to-blue-900/20 border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">🧠</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Take an Assessment
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Complete any of our 7 flagship assessments and save the results.
                  </p>
                </Link>
                
                <Link
                  href="/blog"
                  className="group bg-gradient-to-br from-[#111111] to-purple-900/20 border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">📖</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    Browse Protocols
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Find articles that match your situation and save their keywords.
                  </p>
                </Link>
              </div>
            </motion.div>
          )}

          {/* SAVED ITEMS SECTION */}
          {activeSection === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {favorites.length === 0 ? (
                <div className="text-center py-20 border border-white/10 rounded-3xl">
                  <div className="text-4xl mb-4">🔖</div>
                  <h3 className="text-xl font-bold mb-3">Nothing saved yet</h3>
                  <p className="text-white/50 mb-8 max-w-md mx-auto">
                    Complete assessments or browse articles to start building your personal protocol library.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/tools"
                      className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all"
                    >
                      Explore Assessments →
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-block border border-white/10 text-white/70 font-semibold px-8 py-4 rounded-full hover:border-white/30 hover:text-white transition-all"
                    >
                      Browse Articles
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Saved Tools */}
                  {savedTools.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span>🛠️</span> Saved Assessments ({savedTools.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedTools.map((tool) => (
                          <div
                            key={tool.id}
                            className="relative bg-[#111111] border border-white/10 rounded-3xl p-8 overflow-hidden"
                          >
                            <div 
                              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
                              style={{ backgroundColor: tool.item_color, transform: 'translate(25%, -25%)' }}
                            />
                            
                            <div className="flex justify-between items-start mb-6">
                              <div 
                                className="bg-black/50 border rounded-xl px-4 py-2"
                                style={{ borderColor: `${tool.item_color}40` }}
                              >
                                <p className="text-white/40 text-xs uppercase mb-1">Keyword</p>
                                <p 
                                  className="font-mono font-bold text-lg tracking-widest"
                                  style={{ color: tool.item_color }}
                                >
                                  {tool.item_keyword}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFavorite(tool.id)}
                                className="text-white/20 hover:text-red-400 transition-colors text-sm"
                              >
                                Remove
                              </button>
                            </div>

                            <h3 className="text-xl font-bold mb-6 relative z-10">{tool.item_name}</h3>

                            <Link
                              href={`/tools/${tool.item_slug}`}
                              className="block w-full text-center py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all text-sm font-medium relative z-10"
                            >
                              Retake Assessment
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Protocols */}
                  {savedProtocols.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span>📚</span> Saved Protocols ({savedProtocols.length})
                      </h2>
                      <div className="space-y-4">
                        {savedProtocols.map((protocol) => (
                          <div
                            key={protocol.id}
                            className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-center shrink-0">
                                <p className="font-mono font-bold text-lg tracking-widest text-white">
                                  {protocol.item_keyword}
                                </p>
                              </div>
                              <div>
                                <h3 className="font-bold text-white">{protocol.item_name}</h3>
                                <p className="text-white/40 text-sm">{protocol.item_branch}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Link
                                href={`/blog/${protocol.item_slug}`}
                                className="text-white/50 hover:text-white text-sm transition-colors underline whitespace-nowrap"
                              >
                                Read Article
                              </Link>
                              <button
                                onClick={() => removeFavorite(protocol.id)}
                                className="text-white/20 hover:text-red-400 transition-colors text-sm whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* HISTORY SECTION */}
          {activeSection === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold mb-6">Recent Assessments</h2>
              {history.length === 0 ? (
                <div className="text-center py-12 border border-white/10 rounded-2xl">
                    <p className="text-white/30">No history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item.id} className="bg-[#111111] border border-white/10 rounded-xl p-6 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{item.tool_name}</h3>
                                <p className="text-white/40 text-sm">
                                    {new Date(item.completed_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Link 
                                href={`/tools/${item.tool_slug}`}
                                className="text-white/50 hover:text-white text-sm transition-colors"
                            >
                                View results →
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
