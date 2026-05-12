"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BlogPostClient({ article }: { article: any }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDeepDive, setShowDeepDive] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

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

                {/* Read Aloud & Focus Mode Buttons */}
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
                        <span>{isPlaying ? 'Stop reading' : 'Listen to this article'}</span>
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
                </div>
            </div>

            {/* Main Article Content */}
            <div className="space-y-6 text-white/80 text-lg leading-relaxed mb-16 border-t border-white/10 pt-12">
                {article.problem?.split('\n\n').map((paragraph: string, index: number) => (
                    <div key={index}>
                        <p className="max-w-none mb-6">{paragraph}</p>
                        
                        {/* Inline CTA after the first paragraph (or if there's only one, after the description) */}
                        {index === 0 && (
                            <motion.div 
                                className="my-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 text-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl font-bold mb-3">This hitting close to home?</h3>
                                <p className="text-white/60 mb-6 max-w-md mx-auto">
                                    Don't just close the tab and forget. Sign up once, then text{' '}
                                    <span className="font-mono font-bold text-blue-400">{article.keyword}</span>{' '}
                                    to get the step-by-step protocol on WhatsApp.
                                </p>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-all duration-300"
                                >
                                    Get This Protocol on WhatsApp →
                                </Link>
                            </motion.div>
                        )}
                    </div>
                )) || <p>{article.description}</p>}
            </div>

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
