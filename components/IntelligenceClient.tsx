"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { siteConfig, branches } from '@/lib/constants';

import ArticleCover from './ArticleCover';
import AudioBriefing from './AudioBriefing';
import SaveToPhoneButton from './SaveToPhoneButton';

type Article = {
  slug: string;
  title: string;
  keyword: string;
  branch: string;
  color: string;
  cover_image: string;
  problem: string;
  description: string;
  summary: string;
  tldr: string;
  protocol: string;
  cta: string;
  cta_headline: string;
  deep_dive: string;
  read_time: string;
  audio_url?: string;
  audio_duration_seconds?: number;
};

const supabase = createClient();

export default function IntelligenceClient({ article }: { article: Article }) {
    const { scrollYProgress } = useScroll();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDeepDive, setShowDeepDive] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const router = useRouter();

    // Map branch name to its specific branch color
    const branchColor = branches.find(b => b.name.toLowerCase() === article.branch?.toLowerCase())?.color || '#2dd4bf';

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('user_favorites')
                    .select('id')
                    .eq('item_slug', article.slug)
                    .eq('user_id', user.id)
                    .single();
                if (data) setIsSaved(true);
            }
        }
        checkUser();
    }, [article.slug]);

    const toggleSave = async () => {
        if (!user) {
            router.push('/signup');
            return;
        }

        if (isSaved) {
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('item_type', 'protocol')
                .eq('item_slug', article.slug);
            
            if (!error) setIsSaved(false);
        } else {
            const { error } = await supabase.from('user_favorites').insert({
                user_id: user.id,
                item_type: 'protocol',
                item_slug: article.slug,
                item_name: article.title,
                item_keyword: article.keyword,
                item_color: branchColor,
                item_branch: article.branch
            });

            if (!error) setIsSaved(true);
        }
    };

    // Toggle body class for Focus Mode
    useEffect(() => {
        if (isFocusMode) {
            document.body.classList.add('focus-mode');
        } else {
            document.body.classList.remove('focus-mode');
        }
        return () => document.body.classList.remove('focus-mode');
    }, [isFocusMode]);

    // Cleanup speech synthesis when component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const toggleAudio = () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert("Sorry, your browser doesn't support text-to-speech.");
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            const textToRead = `${article.title}. ${article.problem || article.description}. ${article.tldr}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            
            // Optimize for neurodivergent listening
            utterance.rate = 0.85; // Slightly slower for better processing
            utterance.pitch = 1;
            utterance.volume = 0.9;
            
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
                style={{ 
                    scaleX: scrollYProgress,
                    backgroundColor: branchColor
                }}
            />
            {/* Premium Header */}
            <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16">
                <Link 
                    href="/" 
                    className={`text-xs tracking-[0.3em] uppercase font-semibold transition-colors duration-300 ${
                        isFocusMode ? 'text-stone-400 hover:text-stone-600' : 'text-teal-500/40 hover:text-teal-400/80'
                    }`}
                >
                    SOR7ED
                </Link>
                
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className={`text-xs tracking-widest uppercase transition-colors font-semibold ${
                                isFocusMode ? 'text-stone-500 hover:text-stone-800' : 'text-teal-400/60 hover:text-teal-300'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                            className={`text-xs tracking-widest uppercase transition-colors ${
                                isFocusMode ? 'text-stone-400 hover:text-stone-700' : 'text-white/30 hover:text-white/60'
                            }`}
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/signup"
                        className={`text-xs tracking-widest uppercase transition-colors font-semibold ${
                            isFocusMode ? 'text-stone-400 hover:text-stone-800' : 'text-teal-400/50 hover:text-teal-300'
                        }`}
                    >
                        Sign In →
                    </Link>
                )}
            </div>

            {/* Article Cover Visual */}
            <div className="mb-12">
              <ArticleCover
                keyword={article.keyword}
                branch={article.branch}
                color={branchColor}
                title={article.title}
                imageUrl={article.cover_image || undefined}
              />
            </div>

            {/* Article Header */}
            <div className="mb-12">
                <span 
                    className={`text-[10px] px-3.5 py-1 rounded-full mb-6 inline-block font-mono font-bold tracking-widest uppercase transition-all duration-300 ${
                        isFocusMode 
                            ? 'bg-stone-200 text-stone-700 border border-stone-300' 
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                    }`}
                >
                    {article.branch}
                </span>
                
                <h1 
                    className={`text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight transition-colors duration-300 ${
                        isFocusMode ? 'text-stone-900' : 'text-white'
                    }`}
                >
                    {article.title}
                </h1>

                {/* Read Aloud, Focus Mode & Save Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={toggleAudio}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 ${
                            isPlaying 
                                ? (isFocusMode ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-md' : 'bg-teal-400 text-black border-teal-300 shadow-lg shadow-teal-500/10')
                                : (isFocusMode 
                                    ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200' 
                                    : 'bg-[#0f1719] border-teal-500/10 text-teal-400/80 hover:bg-teal-500/10 hover:text-teal-300')
                        }`}
                    >
                        <span className="text-sm">{isPlaying ? '⏹' : '▶'}</span>
                        <span>{isPlaying ? 'Stop Listening' : 'Listen Aloud'}</span>
                    </button>

                    <button 
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 ${
                            isFocusMode 
                                ? 'bg-[#ff7a45] text-white border-[#ff7a45] shadow-md shadow-orange-500/10' 
                                : 'bg-[#0f1719] border-teal-500/10 text-teal-400/80 hover:bg-teal-500/10 hover:text-teal-300'
                        }`}
                    >
                        <span className="text-sm">{isFocusMode ? '✨' : '🧘'}</span>
                        <span>{isFocusMode ? 'Focus On' : 'Focus Mode'}</span>
                    </button>

                    <button 
                        onClick={toggleSave}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 ${
                            isSaved 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : (isFocusMode 
                                    ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200' 
                                    : 'bg-[#0f1719] border-teal-500/10 text-teal-400/80 hover:bg-teal-500/10 hover:text-teal-300')
                        }`}
                    >
                        <span className="text-sm">{isSaved ? '✓' : '🔖'}</span>
                        <span>{isSaved ? 'Saved to Library' : 'Save Protocol'}</span>
                    </button>
                </div>
            </div>

            {/* Audio Deep Dive */}
            {article.audio_url && (
                <div className="mb-12">
                    <AudioBriefing
                        audioUrl={article.audio_url}
                        title={article.title}
                        duration={article.audio_duration_seconds}
                        branchColor={branchColor}
                        protocolSlug={article.slug}
                    />
                </div>
            )}

            {/* Main Article Content */}
            <div 
                className={`space-y-6 text-lg leading-relaxed mb-16 border-t pt-12 transition-colors duration-300 ${
                    isFocusMode 
                        ? 'border-stone-200 text-stone-850' 
                        : 'border-white/10 text-teal-100/80'
                }`}
            >
                {/* SYSTEM: TL;DR Section */}
                {article.tldr && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`mb-12 border-l-2 p-6 font-mono rounded-r-xl transition-all duration-300 ${
                            isFocusMode 
                                ? 'bg-stone-100 border-stone-400 text-stone-700' 
                                : 'bg-[#0d221d] border-teal-500/30 text-teal-300/90'
                        }`}
                    >
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${
                            isFocusMode ? 'text-stone-400' : 'text-teal-500/40'
                        }`}>
                            SYSTEM: TL;DR
                        </p>
                        <p className="text-base leading-relaxed">
                            {article.tldr}
                        </p>
                    </motion.div>
                )}

                {(article.problem || article.description)
                    ?.split(/\n{2,}/)
                    .map((block: string, index: number) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;

                        // Numbered list item: "1. text" or "1) text"
                        if (/^\d+[\.\)]\s/.test(trimmed)) {
                            const items = trimmed.split(/\n/).filter(Boolean);
                            return (
                                <ol key={index} className="list-decimal list-outside pl-6 space-y-2 mb-2">
                                    {items.map((item, j) => (
                                        <li key={j} className={`text-base leading-relaxed ${isFocusMode ? 'text-stone-800' : 'text-teal-100/70'}`}>
                                            {item.replace(/^\d+[\.\)]\s+/, "")}
                                        </li>
                                    ))}
                                </ol>
                            );
                        }

                        // Bullet list item: "- text" or "• text"
                        if (/^[-•]\s/.test(trimmed)) {
                            const items = trimmed.split(/\n/).filter(Boolean);
                            return (
                                <ul key={index} className="list-disc list-outside pl-6 space-y-2 mb-2">
                                    {items.map((item, j) => (
                                        <li key={j} className={`text-base leading-relaxed ${isFocusMode ? 'text-stone-800' : 'text-teal-100/70'}`}>
                                            {item.replace(/^[-•]\s+/, "")}
                                        </li>
                                    ))}
                                </ul>
                            );
                        }

                        // Heading: short line in ALL CAPS or ends with ":"
                        if (trimmed.length < 80 && (trimmed === trimmed.toUpperCase() || trimmed.endsWith(":"))) {
                            return (
                                <h2 
                                    key={index} 
                                    className={`font-display uppercase text-base tracking-widest mt-12 mb-4 font-bold transition-colors duration-300 ${
                                        isFocusMode ? 'text-stone-900' : 'text-[#ff7a45]'
                                    }`}
                                >
                                    {trimmed.replace(/:$/, "")}
                                </h2>
                            );
                        }

                        // Normal paragraph
                        return (
                            <p key={index} className={`text-base leading-relaxed ${isFocusMode ? 'text-stone-800' : 'text-teal-100/70'}`}>
                                {trimmed}
                            </p>
                        );
                    })
                }
            </div>

            {/* Separate Dynamic CTA Section */}
            <motion.div
                className={`my-16 border rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden transition-all duration-300 ${
                    isFocusMode 
                        ? 'bg-stone-100 border-stone-200 text-stone-900' 
                        : 'bg-gradient-to-br from-[#0c1517] to-[#142327] border-white/5 text-white shadow-2xl'
                }`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                {!isFocusMode && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full" />
                )}
                
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-black mb-4 relative z-10 leading-tight ${
                    isFocusMode ? 'text-stone-900' : 'text-white'
                }`}>
                    {article.cta_headline || "Get the Protocol"}
                </h3>

                <div className={`mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed relative z-10 font-medium ${
                    isFocusMode ? 'text-stone-600' : 'text-teal-100/40'
                }`}>
                    {article.cta ? (
                        <p>{article.cta}</p>
                    ) : (
                        <p>Text the keyword below to get the full step-by-step guide delivered straight to your WhatsApp.</p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4 relative z-10">
                    <SaveToPhoneButton
                        title={article.title}
                        summary={article.summary || article.tldr || undefined}
                        size="lg"
                        label="GET IT SOR7ED"
                        className="w-full max-w-sm"
                    />
                    <p className={`text-[10px] font-bold tracking-[0.25em] uppercase ${
                        isFocusMode ? 'text-stone-400' : 'text-teal-400/30'
                    }`}>
                        Rich link + protocol sent to your WhatsApp
                    </p>
                </div>
            </motion.div>

            {/* Deep Dive Section */}
            {article.deep_dive && (
                <div className={`mb-20 border rounded-3xl overflow-hidden transition-all duration-300 ${
                    isFocusMode 
                        ? 'bg-stone-100 border-stone-200' 
                        : 'bg-[#0a0f10]/80 border-white/5 shadow-xl'
                }`}>
                    <button 
                        onClick={() => setShowDeepDive(!showDeepDive)}
                        className={`w-full px-8 py-6 flex justify-between items-center transition-all duration-300 group ${
                            isFocusMode ? 'hover:bg-stone-200/50' : 'hover:bg-teal-500/5'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-xl">🧠</span>
                            <div className="text-left">
                                <h3 className={`font-bold text-base transition-colors ${
                                    isFocusMode ? 'text-stone-850 group-hover:text-stone-900' : 'text-teal-300/80 group-hover:text-white'
                                }`}>
                                    Deep Dive
                                </h3>
                                <p className={`text-xs ${isFocusMode ? 'text-stone-400' : 'text-teal-400/30'}`}>
                                    The science and context behind this protocol
                                </p>
                            </div>
                        </div>
                        <motion.span 
                            animate={{ rotate: showDeepDive ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`text-xl ${isFocusMode ? 'text-stone-400 group-hover:text-stone-700' : 'text-teal-400/30 group-hover:text-teal-300'}`}
                        >
                            ↓
                        </motion.span>
                    </button>
                    
                    <AnimatePresence>
                        {showDeepDive && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className={`border-t ${isFocusMode ? 'border-stone-200' : 'border-white/5'}`}
                            >
                                <div className={`p-8 leading-relaxed space-y-4 text-base ${
                                    isFocusMode ? 'text-stone-700' : 'text-teal-100/60'
                                }`}>
                                    {article.deep_dive.split('\n\n').map((paragraph: string, index: number) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
