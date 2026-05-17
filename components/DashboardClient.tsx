"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { branches } from '@/lib/constants';
import KeywordToken from '@/components/KeywordToken';
import { getBranchColor } from '@/lib/branch-config';
import { ScoreLevel } from '@/types/assessment';

type Profile = {
  first_name: string | null;
  whatsapp_number: string | null;
  email: string | null;
  weekly_opted_in: boolean | null;
  whatsapp_opted_out: boolean | null;
  created_at: string | null;
};

type ToolSummary = {
  slug: string;
  branch: string;
  color: string;
};

type ActiveSection = 'overview' | 'saved' | 'history' | 'vault' | 'settings';

type DashboardMeta = {
  currentStreak: number;
  weeklyActivity: number[]; // [0] = 6 days ago … [6] = today
  totalAssessments: number;
};

type SavedItem = {
  id: string;
  url: string;
  title: string;
  category: string;
  saved_at: string;
};

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

const SORTED_LEVELS = [
  { name: 'UNSORTED',     min: 0,   max: 2  },
  { name: 'INITIATING',   min: 3,   max: 9  },
  { name: 'CALIBRATING',  min: 10,  max: 24 },
  { name: 'SYNCHRONISED', min: 25,  max: 49 },
  { name: 'SORTED',       min: 50,  max: 99 },
  { name: 'SOR7ED',       min: 100, max: Infinity },
];

function getSortedLevel(total: number) {
  const level = SORTED_LEVELS.findLast(l => total >= l.min) ?? SORTED_LEVELS[0];
  const progress = level.max === Infinity ? 100 : Math.round(((total - level.min) / (level.max - level.min + 1)) * 100);
  return { name: level.name, progress };
}

export default function DashboardClient({
  profile,
  initialFavorites,
  initialHistory,
  tools,
  initialSavedItems = [],
  dashboardMeta = { currentStreak: 0, weeklyActivity: Array(7).fill(0), totalAssessments: 0 },
}: {
  profile: Profile | null;
  initialFavorites: UserFavorite[];
  initialHistory: AssessmentHistory[];
  tools: ToolSummary[];
  initialSavedItems?: SavedItem[];
  dashboardMeta?: DashboardMeta;
}) {
  const searchParams = useSearchParams();
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const sortedLevel = getSortedLevel(dashboardMeta.totalAssessments + initialFavorites.length);

  const [favorites, setFavorites] = useState<UserFavorite[]>(initialFavorites);
  const [history] = useState<AssessmentHistory[]>(initialHistory);
  const [savedItems] = useState<SavedItem[]>(initialSavedItems);
  const [activeSection, setActiveSection] = useState<ActiveSection>(() => {
    const tab = searchParams.get('tab');
    return (tab === 'settings' || tab === 'saved' || tab === 'history' || tab === 'vault') ? tab : 'overview';
  });

  // Settings state
  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(profile?.whatsapp_number ?? '');
  const [weeklyOptIn, setWeeklyOptIn] = useState(profile?.weekly_opted_in ?? false);
  const [waOptOut, setWaOptOut] = useState(profile?.whatsapp_opted_out ?? false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [deletePhase, setDeletePhase] = useState<'idle' | 'confirm'>('idle');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultCategory, setVaultCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);

  const vaultCategories = useMemo(() => {
    const unique = Array.from(new Set(savedItems.map(i => i.category)));
    return ['All', ...unique.sort()];
  }, [savedItems]);

  const filteredVault = useMemo(() => {
    return savedItems.filter(item => {
      const q = vaultSearch.toLowerCase();
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchesCat = vaultCategory === 'All' || item.category === vaultCategory;
      return matchesSearch && matchesCat;
    });
  }, [savedItems, vaultSearch, vaultCategory]);

  const branchCoverage = useMemo(() => {
    const assessedBranches = new Set(
      history
        .map(h => {
          const tool = tools.find(t => t.slug === h.tool_slug);
          return tool?.branch?.toLowerCase().replace(/\s+/g, '-');
        })
        .filter(Boolean)
    );
    return branches.map(b => ({ ...b, isAssessed: assessedBranches.has(b.slug) }));
  }, [history, tools]);

  const removeFavorite = async (id: string) => {
    await supabase.from('user_favorites').delete().eq('id', id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    const updates: Record<string, unknown> = { first_name: firstName, weekly_opted_in: weeklyOptIn, whatsapp_opted_out: waOptOut };
    if (whatsappNumber && !profile?.whatsapp_number) updates.whatsapp_number = whatsappNumber;
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', profile?.email ?? '');
    setSaving(false);
    setSaveMsg(error ? 'Failed to save.' : 'Saved.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const deleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setIsDeleting(true);
    await fetch('/api/account/delete', { method: 'POST' });
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">

      {/* Header */}
      <div className="border-b border-white/5 px-4 sm:px-12 md:px-16 py-8 sm:py-12">
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
              {greeting && (
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">
                  {greeting}{profile?.first_name ? `, ${profile.first_name}` : ''}
                </p>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
                {profile?.first_name || 'Archive'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30">
                <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white/50">
                  ID: {profile?.whatsapp_number || 'PENDING'}
                </span>
                <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white/50">
                  STATUS: ACTIVE
                </span>
                <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-white/40">
                  ◆ {sortedLevel.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/tools"
                className="bg-white text-black px-5 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                + Assessment
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-all group">
                  <span className="sr-only">Sign Out</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/30 group-hover:text-white transition-colors">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <nav className="flex gap-6 sm:gap-8 mt-10 sm:mt-16 border-b border-white/5">
            {([
              { key: 'overview', label: 'Overview' },
              { key: 'saved', label: 'Library' },
              { key: 'history', label: 'History' },
              { key: 'vault', label: `Vault${savedItems.length > 0 ? ` (${savedItems.length})` : ''}` },
              { key: 'settings', label: 'Settings' },
            ] as const).map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeSection === section.key ? 'text-white' : 'text-white/20 hover:text-white/40'
                }`}
              >
                {section.label}
                {activeSection === section.key && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-12 md:px-16 py-10 sm:py-16">
        <AnimatePresence mode="wait">

          {activeSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">

              {/* Chaos banner */}
              <div className="relative rounded-3xl overflow-hidden h-36 sm:h-44">
                <Image
                  src="/Images/chaos-strip.png"
                  alt="The chaos before SOR7ED"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-between px-8">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 mb-2">YOUR MISSION</p>
                    <p className="text-lg sm:text-xl font-black text-white leading-tight">Turn the chaos<br className="sm:hidden" /> into clarity.</p>
                  </div>
                  {dashboardMeta.currentStreak > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-black text-white">{dashboardMeta.currentStreak}🔥</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">day streak</p>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp missing nudge */}
              {!profile?.whatsapp_number && (
                <div className="flex items-center justify-between gap-4 bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl px-6 py-4">
                  <div>
                    <p className="text-sm font-black text-white mb-0.5">Add your WhatsApp number</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Required to receive protocols</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="shrink-0 px-5 py-2.5 rounded-full bg-[#25D366] text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Add now →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Branch Coverage</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {branchCoverage.map((branch, i) => (
                      <motion.div
                        key={branch.slug}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`aspect-square rounded-3xl p-6 flex flex-col justify-between border transition-all duration-500 ${
                          branch.isAssessed ? 'bg-[#0f0f0f] border-white/10' : 'bg-transparent border-white/5 grayscale opacity-30'
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

                <section>
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Intelligence Feed</h2>
                    <button onClick={() => setActiveSection('history')} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors">
                      VIEW ALL →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {history.length === 0 ? (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl">
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No transmissions recorded.</p>
                      </div>
                    ) : (
                      history.slice(0, 3).map(item => (
                        <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-sm font-black"
                              style={{ color: getBranchColor(favorites.find(f => f.item_slug === item.tool_slug)?.item_branch || '') }}>
                              {item.score}
                            </div>
                            <div>
                              <h3 className="font-bold text-base group-hover:text-white/90 transition-colors">{item.tool_name}</h3>
                              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">
                                {new Date(item.completed_at).toLocaleDateString()} · {item.level?.toUpperCase() || 'CALIBRATED'}
                              </p>
                            </div>
                          </div>
                          <Link href={`/tools/${item.tool_slug}`} className="text-white/20 group-hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-12">
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">System Stats</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Saved Protocols', value: favorites.length },
                      { label: 'Assessments', value: history.length },
                      { label: 'Coverage', value: `${Math.round((branchCoverage.filter(b => b.isAssessed).length / 7) * 100)}%` },
                    ].map(stat => (
                      <div key={stat.label} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</span>
                        <span className="text-xl font-black">{stat.value}</span>
                      </div>
                    ))}
                    {dashboardMeta.currentStreak > 0 && (
                      <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Day Streak</span>
                        <span className="text-xl font-black">{dashboardMeta.currentStreak}🔥</span>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">This Week</h2>
                  <WeeklyChart data={dashboardMeta.weeklyActivity} />
                </section>

                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Active Keywords</h2>
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8">
                    {favorites.length === 0 ? (
                      <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center py-4">No active keywords.</p>
                    ) : (
                      <div className="space-y-6">
                        {favorites.slice(0, 5).map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <KeywordToken keyword={item.item_keyword} color={item.item_color} size="small" />
                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter truncate max-w-[100px]">{item.item_name}</span>
                          </div>
                        ))}
                        <button onClick={() => setActiveSection('saved')} className="w-full text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors mt-4">
                          VIEW ALL →
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              </div>{/* end grid */}
            </motion.div>
          )}

          {activeSection === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
              {favorites.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px]">
                  <div className="text-4xl mb-8">🔖</div>
                  <h3 className="text-2xl font-black mb-4">Library Empty</h3>
                  <p className="text-white/30 mb-12 max-w-sm mx-auto text-sm leading-relaxed">Build your intelligence archive by saving tools and protocols.</p>
                  <Link href="/tools" className="inline-block bg-white text-black font-black px-10 py-5 rounded-full hover:scale-105 transition-all">
                    INITIATE DISCOVERY →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {favorites.map(item => (
                    <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 group transition-all hover:border-white/10">
                      <div className="flex justify-between items-start mb-8">
                        <KeywordToken keyword={item.item_keyword} color={item.item_color} size="medium" />
                        <button onClick={() => removeFavorite(item.id)} className="p-3 rounded-full hover:bg-red-500/10 text-white/10 hover:text-red-500 transition-all">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{item.item_name}</h3>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{item.item_branch} · {item.item_type}</p>
                      <Link
                        href={item.item_type === 'tool' ? `/tools/${item.item_slug}` : `/intelligence/${item.item_slug}`}
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

          {activeSection === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
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
                  {history.map(item => (
                    <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-all group">
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
                      <Link href={`/tools/${item.tool_slug}`} className="px-6 py-3 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white hover:text-black hover:border-white transition-all text-center">
                        VIEW REPORT →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">WhatsApp Vault</h2>
                <span className="text-[10px] font-bold text-white/20 uppercase">{savedItems.length} saved</span>
              </div>

              {savedItems.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px]">
                  <div className="text-4xl mb-8">📱</div>
                  <h3 className="text-2xl font-black mb-4">Vault Empty</h3>
                  <p className="text-white/30 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
                    Click &ldquo;Save to WhatsApp&rdquo; on any article or tool — it lands here and in your chat.
                  </p>
                  <Link href="/tools" className="inline-block bg-white text-black font-black px-10 py-5 rounded-full hover:scale-105 transition-all">
                    EXPLORE TOOLS →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Search */}
                  <div className="relative max-w-md">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchRef}
                      type="text"
                      value={vaultSearch}
                      onChange={e => setVaultSearch(e.target.value)}
                      placeholder="Search saved items..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all"
                    />
                    {vaultSearch && (
                      <button onClick={() => setVaultSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">✕</button>
                    )}
                  </div>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2">
                    {vaultCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setVaultCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          vaultCategory === cat
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white/30 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Grid */}
                  {filteredVault.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/5 rounded-[32px]">
                      <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-4">No matches</p>
                      <button onClick={() => { setVaultSearch(''); setVaultCategory('All'); }} className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                        Clear filters →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredVault.map((item, i) => (
                        <VaultCard key={item.id} item={item} index={i} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16 max-w-xl">

              {/* Profile */}
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Email</label>
                    <input
                      type="email"
                      value={profile?.email ?? ''}
                      disabled
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white/30 text-sm cursor-not-allowed"
                    />
                    <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest">Email changes require re-signup</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">WhatsApp Number</label>
                    {profile?.whatsapp_number ? (
                      <>
                        <input
                          type="text"
                          value={profile.whatsapp_number}
                          disabled
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white/30 text-sm cursor-not-allowed"
                        />
                        <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest">Text STOP / START to manage via WhatsApp</p>
                      </>
                    ) : (
                      <>
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={e => setWhatsappNumber(e.target.value)}
                          placeholder="+44 7700 900000"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-white/20"
                        />
                        <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest">Include country code — required to receive protocols</p>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* WhatsApp preferences */}
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">WhatsApp Preferences</h2>
                <div className="space-y-3">
                  {([
                    { label: 'Weekly Intelligence Briefings', sub: 'Get one protocol delivered every Tuesday', value: weeklyOptIn, set: setWeeklyOptIn },
                    { label: 'Pause All WhatsApp Messages', sub: 'Re-enable anytime by texting START', value: waOptOut, set: setWaOptOut },
                  ] as const).map(item => (
                    <div key={item.label} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-white/30 mt-0.5 font-bold uppercase tracking-widest">{item.sub}</p>
                      </div>
                      <button
                        onClick={() => item.set(!item.value)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${item.value ? 'bg-white' : 'bg-white/10'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-300 ${item.value ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Save button */}
              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
              >
                {saving ? 'Saving…' : saveMsg || 'Save Changes'}
              </button>

              {/* Member since */}
              {profile?.created_at && (
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              )}

              {/* Danger zone */}
              <section className="border-t border-white/5 pt-16">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 mb-8">Danger Zone</h2>

                {deletePhase === 'idle' && (
                  <button
                    onClick={() => setDeletePhase('confirm')}
                    className="px-6 py-3 rounded-2xl border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                  >
                    Delete Account
                  </button>
                )}

                {deletePhase === 'confirm' && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 space-y-6">
                    <div>
                      <p className="text-sm font-bold text-white mb-2">This is permanent.</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Your account, saved protocols, assessment history, and all data will be deleted immediately. This cannot be undone.
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Type DELETE to confirm</label>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={e => setDeleteInput(e.target.value)}
                        placeholder="DELETE"
                        className="w-full bg-white/5 border border-red-500/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={deleteAccount}
                        disabled={deleteInput !== 'DELETE' || isDeleting}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? 'Deleting…' : 'Delete My Account'}
                      </button>
                      <button
                        onClick={() => { setDeletePhase('idle'); setDeleteInput(''); }}
                        className="px-6 py-3 rounded-xl border border-white/10 text-white/40 text-xs font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}

function WeeklyChart({ data }: { data: number[] }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const max = Math.max(...data, 1);
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5">
      <div className="flex items-end justify-between gap-1.5 h-12 mb-3">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div
              className="w-full rounded-sm bg-white/80 transition-all duration-500"
              style={{ height: `${Math.max((val / max) * 100, val > 0 ? 15 : 4)}%`, opacity: val === 0 ? 0.08 : 1 }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {days.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[8px] font-black uppercase text-white/20">{d}</span>
        ))}
      </div>
    </div>
  );
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return ''; }
}

function VaultCard({ item, index }: { item: SavedItem; index: number }) {
  const [resend, setResend] = useState<'idle' | 'sending' | 'done' | 'err'>('idle');

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    setResend('sending');
    try {
      const res = await fetch('/api/save-to-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, pageUrl: item.url }),
      });
      setResend(res.ok ? 'done' : 'err');
    } catch {
      setResend('err');
    }
    setTimeout(() => setResend('idle'), 3000);
  };

  const age = (() => {
    const d = Math.floor((Date.now() - new Date(item.saved_at).getTime()) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    if (d < 7) return `${d}d ago`;
    return new Date(item.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/10 transition-all group"
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 bg-white/5 px-3 py-1 rounded-full">
          {item.category}
        </span>
        <span className="text-[9px] text-white/20 font-bold">{age}</span>
      </div>

      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1">
        <h3 className="font-bold text-base leading-snug group-hover:text-white/80 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-white/20 text-xs mt-1">{getDomain(item.url)}</p>
      </a>

      <div className="flex gap-3 pt-2 border-t border-white/5">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-2.5 rounded-xl bg-white/5 text-white/30 hover:bg-white/10 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Open
        </a>
        <button
          onClick={handleResend}
          disabled={resend !== 'idle'}
          className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed ${
            resend === 'idle' ? 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white' :
            resend === 'sending' ? 'bg-white/5 text-white/20' :
            resend === 'done' ? 'bg-green-500/10 text-green-400' :
            'bg-red-500/10 text-red-400'
          }`}
        >
          {resend === 'idle' && '📱 Send'}
          {resend === 'sending' && 'Sending…'}
          {resend === 'done' && '✓ Sent'}
          {resend === 'err' && 'Failed'}
        </button>
      </div>
    </motion.div>
  );
}
