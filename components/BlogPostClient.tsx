"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

import ArticleCover from './ArticleCover';

type Article = {
  slug: string;
  title: string;
  keyword: string;
  branch: string;
  color: string;
  problem: string;
  description: string;
  tldr: string;
  protocol: string;
  cta: string;
  cta_headline: string;
  deep_dive: string;
  read_time: string;
};

const supabase = createClient();

export default function BlogPostClient({ article }: { article: Article }) {
    const { scrollYProgress } = useScroll();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDeepDive, setShowDeepDive] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const router = useRouter();

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
                item_color: '#3B82F6', // Default color for protocols
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
                    backgroundColor: article.color || '#3B82F6'
                }}
            />
            {/* Premium Header */}
            <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16">
                <Link href="/" className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors">
                    SOR7ED
                </Link>
                
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-white/50 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                            className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/signup"
                        className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
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
                color={article.color || "#3B82F6"} 
                title={article.title} 
              />
            </div>

            {/* Article Header */}
            <div className="mb-12">
                <span 
                    className="text-xs px-3 py-1 rounded-full mb-6 inline-block font-medium tracking-widest uppercase bg-white/5 text-white/50 border border-white/10"
                >
                    {article.branch}
                </span>
                
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                    {article.title}
                </h1>

                {/* Read Aloud, Focus Mode & Save Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={toggleAudio}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-300 ${
                            isPlaying 
                                ? 'bg-white text-black border-white shadow-lg' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="text-lg">{isPlaying ? '⏹' : '▶'}</span>
                        <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button 
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-300 ${
                            isFocusMode 
                                ? 'bg-blue-500 text-white border-blue-400 shadow-lg' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="text-lg">{isFocusMode ? '✨' : '🧘'}</span>
                        <span>{isFocusMode ? 'Focus On' : 'Focus Mode'}</span>
                    </button>

                    <button 
                        onClick={toggleSave}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-300 ${
                            isSaved 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="text-lg">{isSaved ? '✓' : '🔖'}</span>
                        <span>{isSaved ? 'Saved' : 'Save Protocol'}</span>
                    </button>
                </div>
            </div>

            {/* Main Article Content */}
            <div className="space-y-6 text-white/80 text-lg leading-relaxed mb-16 border-t border-white/10 pt-12">
                
                {/* SYSTEM: TL;DR Section */}
                {article.tldr && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12 bg-white/5 border-l-2 border-white/20 p-6 font-mono"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">SYSTEM: TL;DR</p>
                        <p className="text-white/70 text-base leading-relaxed">
                            {article.tldr}
                        </p>
                    </motion.div>
                )}

                {article.problem?.split('\n\n').map((paragraph: string, index: number) => (
                    <div key={index}>
                        <p className="max-w-none mb-6">{paragraph}</p>
                    </div>
                )) || <p>{article.description}</p>}
            </div>

            {/* Separate Dynamic CTA Section */}
            <motion.div 
                className="my-20 bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 md:p-14 text-center relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[100px] rounded-full" />
                
                <h3 className="text-2xl md:text-4xl font-black mb-6 relative z-10 leading-tight">
                    {article.cta_headline || "Get the Protocol"}
                </h3>
                
                <div className="text-white/40 mb-12 max-w-xl mx-auto text-lg md:text-xl leading-relaxed relative z-10 font-medium">
                    {article.cta ? (
                        <p>{article.cta}</p>
                    ) : (
                        <p>Text the keyword below to get the full step-by-step guide delivered straight to your WhatsApp.</p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-8 relative z-10">
                    {/* Visual Keyword Token */}
                    <div className="bg-black/80 border border-white/10 rounded-3xl px-12 py-8 inline-block shadow-2xl scale-110 mb-4">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">WHATSAPP TRIGGER</p>
                        <p className="text-5xl md:text-6xl font-black tracking-[0.2em] text-white">
                            {article.keyword}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-lg mt-4">
                        <Link
                            href={`https://wa.me/447360277713?text=${encodeURIComponent(article.keyword)}`}
                            target="_blank"
                            className="flex-[2] bg-white text-black font-black px-10 py-6 rounded-full hover:scale-105 transition-all text-xl uppercase tracking-[0.2em] flex items-center justify-center"
                        >
                            {article.keyword}
                        </Link>
                        <button
                            onClick={toggleSave}
                            className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                                isSaved
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-transparent border-white/10 text-white/30 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {isSaved ? 'SAVED' : 'SAVE'}
                        </button>
                    </div>
                    
                    <p className="text-white/10 text-[10px] font-bold tracking-widest uppercase">
                        Requires free SOR7ED account
                    </p>
                </div>
            </motion.div>

            {/* Deep Dive Section */}
            {article.deep_dive && (
                <div className="mb-20 border border-white/10 rounded-3xl overflow-hidden bg-[#111111]">
                    <button 
                        onClick={() => setShowDeepDive(!showDeepDive)}
                        className="w-full px-8 py-6 flex justify-between items-center hover:bg-white/5 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🧠</span>
                            <div className="text-left">
                                <h3 className="font-bold text-lg group-hover:text-white transition-colors">Deep Dive</h3>
                                <p className="text-white/40 text-sm">The science and context behind this protocol</p>
                            </div>
                        </div>
                        <motion.span 
                            animate={{ rotate: showDeepDive ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl text-white/40 group-hover:text-white/60 transition-colors"
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
                                className="border-t border-white/10"
                            >
                                <div className="p-8 text-white/70 leading-relaxed space-y-4">
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
