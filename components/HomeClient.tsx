'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const WHATSAPP_LINK = `https://wa.me/447591922247?text=SOR7ED`;

export default function HomeClient() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToCard = (index: number) => {
        const clamped = Math.max(0, Math.min(index, branches.length - 1));
        setActiveIndex(clamped);
        const container = carouselRef.current;
        if (!container) return;
        const card = container.children[clamped] as HTMLElement;
        if (card) {
            container.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ── HERO ── */}
            <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-16">
                <div className="max-w-5xl">
                    <motion.p
                        className="text-xs tracking-[0.35em] uppercase text-white/25 mb-8 font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Practical protocols via WhatsApp
                    </motion.p>

                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.0] tracking-tight uppercase"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Every part of your life.<br />
                        <span className="text-white/30">Simplified into 7 branches.</span>
                    </motion.h1>

                    {/* Branch pills */}
                    <motion.div
                        className="flex flex-wrap gap-2 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {branches.map((branch) => (
                            <Link
                                key={branch.slug}
                                href={`/${branch.slug}`}
                                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 hover:opacity-80"
                                style={{
                                    borderColor: `${branch.color}50`,
                                    color: branch.color,
                                    backgroundColor: `${branch.color}10`,
                                }}
                            >
                                {branch.name}
                            </Link>
                        ))}
                    </motion.div>

                    <motion.p
                        className="text-white/40 text-base md:text-lg max-w-lg leading-relaxed mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-sm bg-[#2563EB] hover:bg-[#1d4ed8] transition-all duration-300 hover:scale-105"
                        >
                            Sign up — it&apos;s free
                        </Link>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white/40 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
                        >
                            Text SOR7ED on WhatsApp
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── 7 BRANCHES CAROUSEL ── */}
            <section className="pb-28" id="branches">
                <div className="px-6 md:px-16 mb-6 flex items-center justify-between">
                    <div>
                        <span className="text-white/20 text-xs tracking-[0.35em] uppercase font-bold block mb-2">
                            7 Branches of Life
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Find what fits. Get it on WhatsApp.
                        </h2>
                    </div>
                    {/* Nav arrows */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => scrollToCard(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                            aria-label="Previous branch"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scrollToCard(activeIndex + 1)}
                            disabled={activeIndex === branches.length - 1}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                            aria-label="Next branch"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div
                    ref={carouselRef}
                    className="flex gap-4 px-6 md:px-16 overflow-x-auto pb-4"
                    style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
                    onScroll={(e) => {
                        const container = e.currentTarget;
                        const scrollLeft = container.scrollLeft;
                        let closest = 0;
                        let minDist = Infinity;
                        Array.from(container.children).forEach((child, i) => {
                            const el = child as HTMLElement;
                            const dist = Math.abs(el.offsetLeft - scrollLeft - 24);
                            if (dist < minDist) { minDist = dist; closest = i; }
                        });
                        setActiveIndex(closest);
                    }}
                >
                    {branches.map((branch, i) => (
                        <motion.div
                            key={branch.slug}
                            style={{ scrollSnapAlign: 'start' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="shrink-0"
                        >
                            <Link
                                href={`/${branch.slug}`}
                                className="relative block w-[280px] md:w-[320px] h-[220px] rounded-3xl overflow-hidden border border-white/8 bg-[#0f0f0f] hover:border-white/20 transition-all duration-300 group"
                            >
                                {/* Large background number */}
                                <span
                                    className="absolute -bottom-4 -right-2 text-[140px] font-black leading-none select-none pointer-events-none"
                                    style={{ color: `${branch.color}18` }}
                                >
                                    {branch.num}
                                </span>

                                <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                                    <div>
                                        <span className="text-2xl mb-3 block">{branch.icon}</span>
                                        <h3
                                            className="text-2xl font-black tracking-tight mb-2"
                                            style={{ color: branch.color }}
                                        >
                                            {branch.name}
                                        </h3>
                                        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                            {branch.description}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                                        Explore →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {branches.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToCard(i)}
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: i === activeIndex ? branches[activeIndex].color : 'rgba(255,255,255,0.15)',
                                transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                            }}
                            aria-label={`Go to branch ${i + 1}`}
                        />
                    ))}
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
