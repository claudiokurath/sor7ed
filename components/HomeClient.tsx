'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const WHATSAPP_LINK = `https://wa.me/447591922247?text=SOR7ED`;

const taglines = [
    { word: 'Overwhelmed', color: '#E94560' },
    { word: 'Scattered',   color: '#A855F7' },
    { word: 'Exhausted',   color: '#FF6B6B' },
    { word: 'Wired differently', color: '#4ECDC4' },
    { word: 'Behind',      color: '#F4A261' },
    { word: 'Stuck',       color: '#E9C46A' },
];

export default function HomeClient() {
    const [taglineIndex, setTaglineIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex(i => (i + 1) % taglines.length);
        }, 2400);
        return () => clearInterval(interval);
    }, []);

    const current = taglines[taglineIndex];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ── HERO ── */}
            <section className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-16 pt-20 overflow-hidden">

                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: backgroundOpacity }}
                >
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07] blur-3xl"
                        style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
                    />
                </motion.div>

                <div className="relative z-10 max-w-5xl">
                    <motion.p
                        className="text-xs tracking-[0.35em] uppercase text-white/25 mb-8 font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Practical protocols via WhatsApp
                    </motion.p>

                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-[1.0] tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        If you&apos;re feeling
                    </motion.h1>

                    <motion.div
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1.0] h-[1.1em] overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={taglineIndex}
                                initial={{ y: 70, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -70, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{ color: current.color, display: 'block', trackingTight: true }}
                                className="tracking-tight"
                            >
                                {current.word}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>

                    <motion.p
                        className="text-white/40 text-lg md:text-xl max-w-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm bg-[#2563EB] hover:bg-[#1d4ed8] transition-all duration-300 hover:scale-105"
                        >
                            Sign up — it&apos;s free
                        </Link>
                        <a
                            href="#branches"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white/50 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
                        >
                            Explore the 7 branches
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
                </motion.div>
            </section>

            {/* ── 7 BRANCHES DIVIDER ── */}
            <section className="px-6 md:px-16 pt-16 pb-8" id="branches">
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-white/20 text-xs tracking-[0.35em] uppercase font-bold">
                        7 Branches of Life
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                </motion.div>

                <motion.h2
                    className="text-3xl md:text-5xl font-black text-white mt-2 mb-3 tracking-tight leading-[1.0]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Every part of your life,<br />simplified.
                </motion.h2>
                <motion.p
                    className="text-white/30 text-base max-w-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Each branch contains articles and tools that come with step-by-step protocols. Find what matches your problem here, then get the protocol on WhatsApp.
                </motion.p>
            </section>

            {/* ── BRANCH CAROUSEL ── */}
            <section className="pb-24">
                <div
                    ref={containerRef}
                    className="flex gap-5 px-6 md:px-16 overflow-x-auto pb-4"
                    style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
                >
                    {branches.map((branch, i) => (
                        <motion.div
                            key={branch.slug}
                            style={{ scrollSnapAlign: 'start' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            whileHover={{ y: -4 }}
                        >
                            <Link
                                href={`/${branch.slug}`}
                                className="block min-w-[280px] md:min-w-[320px] p-8 rounded-3xl border border-white/8 bg-[#0f0f0f] hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <span className="text-3xl">{branch.icon}</span>
                                    <span className="text-white/15 font-mono text-xs font-bold">{branch.num}</span>
                                </div>
                                <h3
                                    className="text-2xl font-black mb-3 tracking-tight"
                                    style={{ color: branch.color }}
                                >
                                    {branch.name}
                                </h3>
                                <p className="text-white/35 text-sm leading-relaxed">
                                    {branch.description}
                                </p>
                                <div className="mt-6">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                                        Explore →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <motion.div style={{ scrollSnapAlign: 'start' }}>
                        <Link
                            href="/explore"
                            className="flex min-w-[180px] h-full items-center justify-center rounded-3xl border border-dashed border-white/10 hover:border-white/25 transition-all duration-300 group px-8"
                        >
                            <span className="text-white/25 group-hover:text-white/50 text-sm font-bold uppercase tracking-widest transition-colors">
                                See all →
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── MISSION STRIP ── */}
            <section className="px-6 md:px-16 py-28 border-t border-white/5">
                <div className="max-w-4xl">
                    <motion.p
                        className="text-xs tracking-[0.35em] uppercase text-white/20 mb-8 font-bold"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Our mission
                    </motion.p>
                    <motion.h2
                        className="text-4xl md:text-6xl font-black text-white leading-[1.0] tracking-tight mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        The world wasn&apos;t built for your brain.<br />
                        <span className="text-white/30">We build systems that are.</span>
                    </motion.h2>
                    <motion.p
                        className="text-white/40 text-lg max-w-2xl leading-relaxed mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software. SOR7ED is that software, delivered one protocol at a time.
                    </motion.p>
                    <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm bg-[#2563EB] hover:bg-[#1d4ed8] transition-all duration-300 hover:scale-105"
                        >
                            Get started free
                        </Link>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white/40 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
                        >
                            Text SOR7ED on WhatsApp
                        </a>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
