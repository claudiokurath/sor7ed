import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { branches } from "@/lib/constants";
import IntelligenceGrid from "@/components/IntelligenceGrid";

export default async function IntelligencePage() {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    if (error) console.error('Error fetching protocols:', error);

    const allPosts = posts || [];
    const featured = allPosts[0] ?? null;
    const rest = allPosts.slice(1);

    const featuredBranch = featured ? branches.find(b => b.name === featured.branch) : null;
    const featuredColor = featuredBranch?.color ?? '#3B82F6';

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">

            {/* NAV */}
            <div className="px-5 pt-8 pb-0 flex justify-between items-center max-w-6xl mx-auto">
                <Link href="/" className="flex items-center gap-2 opacity-25 hover:opacity-60 transition-opacity">
                    <span className="text-white text-sm">←</span>
                    <Image src="/Images/Logo2026.png" alt="SOR7ED" width={60} height={24} className="h-5 w-auto" />
                </Link>
                <Link href="/signup" className="text-white/30 text-[10px] tracking-widest uppercase font-medium hover:text-white transition-colors">
                    Sign In
                </Link>
            </div>

            {/* HERO */}
            <section className="px-5 pt-14 pb-14 max-w-6xl mx-auto">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 font-black">
                        Field Intelligence
                    </p>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.92] mb-5 uppercase">
                        The context<br />behind the protocol.
                    </h1>
                    <p className="text-white/40 text-base sm:text-lg leading-relaxed">
                        These briefings explain the <em>why</em> behind your friction — so you understand your brain, not just manage it.
                    </p>
                </div>

                {/* HOW IT WORKS — stacked on mobile, row on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    {[
                        { num: '01', label: 'Read the briefing', desc: 'Understand the friction' },
                        { num: '02', label: 'Text the keyword', desc: 'Get the protocol instantly' },
                        { num: '03', label: 'Run it today', desc: '2 minutes. Real results.' },
                    ].map(step => (
                        <div key={step.num} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0 bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest sm:mb-3 shrink-0">{step.num}</p>
                            <div>
                                <p className="text-xs font-bold text-white sm:mb-1 leading-snug">{step.label}</p>
                                <p className="text-[10px] text-white/30 leading-snug">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="border-t border-white/5" />

            {/* FEATURED ARTICLE */}
            {featured && (
                <section className="px-5 py-12 max-w-6xl mx-auto">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-6 font-black">Latest Briefing</p>
                    <Link href={`/intelligence/${featured.slug}`} className="group block">
                        <div
                            className="rounded-3xl border border-white/10 p-6 sm:p-10 md:p-14 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                            style={{ background: `radial-gradient(ellipse at 80% 0%, ${featuredColor}12, transparent 60%)` }}
                        >
                            {/* Ambient glow — desktop only */}
                            <div
                                className="hidden md:block absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] opacity-15 pointer-events-none"
                                style={{ background: featuredColor }}
                            />

                            <div className="relative z-10">
                                {/* Branch tag */}
                                <span
                                    className="inline-block text-[9px] px-3 py-1.5 rounded-full tracking-[0.25em] uppercase font-black border mb-5"
                                    style={{
                                        backgroundColor: `${featuredColor}18`,
                                        color: featuredColor,
                                        borderColor: `${featuredColor}35`,
                                    }}
                                >
                                    {featured.branch}
                                </span>

                                {/* Title */}
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4 group-hover:text-white/80 transition-colors">
                                    {featured.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
                                    {featured.summary || featured.tldr || featured.excerpt}
                                </p>

                                {/* Footer row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black uppercase tracking-widest transition-colors" style={{ color: featuredColor }}>
                                            Read Briefing →
                                        </span>
                                        {featured.read_time && (
                                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                                · {featured.read_time} read
                                            </span>
                                        )}
                                    </div>
                                    {/* Keyword token */}
                                    <div className="bg-black/60 border border-white/15 rounded-xl px-5 py-3 font-mono flex items-center gap-2 self-start sm:self-auto">
                                        <span>⚡</span>
                                        <span className="font-black tracking-widest text-base" style={{ color: featuredColor }}>
                                            {featured.keyword}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* ARTICLE GRID */}
            {rest.length > 0 && (
                <section className="px-5 pb-20 max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-black shrink-0">All Briefings</p>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[9px] text-white/15 font-bold uppercase shrink-0">{rest.length}</span>
                    </div>
                    <IntelligenceGrid posts={rest} />
                </section>
            )}

            {/* CTA */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-5 py-20">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4 font-black">Get them on WhatsApp</p>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                                Read it here.<br />Run it on WhatsApp.
                            </h2>
                            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                                Text any keyword to get the full step-by-step protocol instantly. No app, no login, no friction.
                            </p>
                        </div>
                        <Link
                            href="/signup"
                            className="shrink-0 inline-flex items-center px-8 py-4 rounded-full font-black text-black bg-white hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
                        >
                            Sign up free →
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
