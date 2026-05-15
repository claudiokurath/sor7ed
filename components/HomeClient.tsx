'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ROTATING_WORDS = [
    { text: 'Overwhelmed', color: '#E94560' },
    { text: 'Exhausted', color: '#FF6B6B' },
    { text: 'Wired differently', color: '#4ECDC4' },
    { text: 'Scattered', color: '#A855F7' },
    { text: 'Behind', color: '#F4A261' },
    { text: 'Stuck', color: '#E9C46A' },
];

const WHATSAPP_NUMBER = "+44 7591 922247";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=SOR7ED`;

type Tool = {
    slug: string;
    name: string;
    tldr: string;
    cover_image: string | null;
    color: string | null;
    branch: string;
};

type Article = {
    slug: string;
    title: string;
    excerpt: string | null;
    summary: string | null;
    cover_image: string | null;
    read_time: string | null;
    branch: string;
};

function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
                setIsAnimating(false);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const current = ROTATING_WORDS[currentIndex];

    return (
        <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-colors duration-1000"
                style={{ backgroundColor: current.color }}
            />
            <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8 block">
                    Practical protocols via WhatsApp
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
                    <span className="block">If you&apos;re feeling</span>
                    <span
                        className="block transition-all duration-500 ease-out"
                        style={{
                            color: current.color,
                            opacity: isAnimating ? 0 : 1,
                            transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
                            filter: isAnimating ? 'blur(4px)' : 'blur(0)',
                        }}
                    >
                        {current.text}
                    </span>
                </h1>
                <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed">
                    SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                    <Link
                        href="/explore"
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full font-semibold transition inline-flex items-center gap-2"
                    >
                        Explore Your Branches
                    </Link>
                    <Link
                        href="/signup"
                        className="border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-full font-semibold transition"
                    >
                        Sign up free
                    </Link>
                </div>
                <p className="text-sm text-white/30">
                    Text <span className="text-white/50 font-mono">SOR7ED</span> to{' '}
                    <a href={WHATSAPP_LINK} className="text-white/50 hover:text-white underline">
                        {WHATSAPP_NUMBER}
                    </a>
                </p>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
        </section>
    );
}

function AssessmentsSection({ tools }: { tools: Tool[] }) {
    if (tools.length === 0) return null;
    return (
        <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3">Interactive</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">Assessments.</h2>
                    <p className="text-white/40 mt-3 max-w-md">Find out exactly where you stand — and what to do about it.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tools.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="group rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 bg-[#0f0f0f] transition-all duration-300"
                        >
                            <div className="h-40 overflow-hidden bg-white/5">
                                {tool.cover_image ? (
                                    <img
                                        src={tool.cover_image}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full"
                                        style={{ background: `linear-gradient(135deg, ${tool.color || '#ffffff'}15, transparent)` }}
                                    />
                                )}
                            </div>
                            <div className="p-6">
                                <span
                                    className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 inline-block"
                                    style={{ backgroundColor: `${tool.color || '#ffffff'}20`, color: tool.color || '#ffffff' }}
                                >
                                    {tool.branch}
                                </span>
                                <h3 className="text-lg font-black mb-2 leading-tight">{tool.name}</h3>
                                <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{tool.tldr}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/explore" className="text-sm text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest">
                        Browse all branches →
                    </Link>
                </div>
            </div>
        </section>
    );
}

function BlogSection({ articles }: { articles: Article[] }) {
    if (articles.length === 0) return null;
    return (
        <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3">Intelligence</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">Protocols & Briefings.</h2>
                    <p className="text-white/40 mt-3 max-w-md">Practical reads for the way your brain actually works.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/intelligence/${article.slug}`}
                            className="group rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 bg-[#0f0f0f] transition-all duration-300"
                        >
                            <div className="h-40 overflow-hidden bg-white/5">
                                {article.cover_image ? (
                                    <img
                                        src={article.cover_image}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/[0.02]" />
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs uppercase tracking-widest font-bold text-white/25">{article.branch}</span>
                                    {article.read_time && (
                                        <span className="text-xs text-white/25 font-bold uppercase tracking-widest">{article.read_time}</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-black mb-2 leading-tight group-hover:text-white/80 transition-colors">{article.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                    {article.excerpt || article.summary}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutSection() {
    return (
        <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3">Who we are</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Built for brains that don&apos;t fit the mould.</h2>
                        <p className="text-white/50 leading-relaxed mb-6">
                            SOR7ED was built by and for neurodivergent adults who are tired of advice that was never designed for them. No fluff, no toxic positivity — just practical protocols that work with your brain, not against it.
                        </p>
                        <p className="text-white/50 leading-relaxed">
                            Seven branches of life. Delivered to your WhatsApp. Start free, go deeper when you&apos;re ready.
                        </p>
                    </div>
                    <div className="space-y-5">
                        {[
                            { label: '7', desc: 'Branches of life covered' },
                            { label: '50+', desc: 'Protocols and tools' },
                            { label: '1', desc: 'WhatsApp number to remember' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center gap-6 border border-white/5 rounded-2xl p-6">
                                <span className="text-4xl font-black text-white/80 w-20 shrink-0">{stat.label}</span>
                                <span className="text-white/40">{stat.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function WhatsAppCTA() {
    return (
        <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Get sorted today.</h2>
                <p className="text-white/40 mb-10">Free protocols on WhatsApp. No credit card. No waiting.</p>
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold text-lg transition"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Message {WHATSAPP_NUMBER}
                </a>
                <p className="text-xs text-white/20 mt-6">
                    Or text <span className="text-white/40 font-mono">SOR7ED</span> to get started
                </p>
            </div>
        </section>
    );
}

export default function HomeClient({ tools, articles }: { tools: Tool[]; articles: Article[] }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Hero />
            <AssessmentsSection tools={tools} />
            <BlogSection articles={articles} />
            <AboutSection />
            <WhatsAppCTA />
        </div>
    );
}
