import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import IntelligenceList from "@/components/IntelligenceList";
import { branches } from "@/lib/constants";

export default async function IntelligencePage() {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching protocols:', error);
    }

    const allPosts = posts || [];
    const featured = allPosts[0] ?? null;
    const rest = allPosts.slice(1);

    const featuredBranch = featured
        ? branches.find(b => b.name === featured.branch)
        : null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">

            {/* NAV */}
            <div className="px-6 sm:px-12 md:px-16 pt-10 pb-0 flex justify-between items-center">
                <Link href="/" className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-bold hover:text-white/40 transition-colors">
                    ← SOR7ED
                </Link>
                <Link href="/signup" className="text-white/30 text-[10px] tracking-widest uppercase font-medium hover:text-white transition-colors">
                    Sign In
                </Link>
            </div>

            {/* HERO */}
            <section className="px-6 sm:px-12 md:px-16 pt-20 pb-16 border-b border-white/5">
                <div className="max-w-5xl">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/20 mb-6 font-black">
                        Field Intelligence
                    </p>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 uppercase">
                        The context<br />behind the protocol.
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl leading-relaxed mb-10">
                        Every protocol in SOR7ED is backed by research and lived experience. These briefings explain the why — so you understand your brain, not just manage it.
                    </p>

                    {/* HOW IT WORKS — 3 steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                        {[
                            { num: '01', label: 'Read the briefing', desc: 'Understand the friction' },
                            { num: '02', label: 'Text the keyword', desc: 'Get the protocol on WhatsApp' },
                            { num: '03', label: 'Run it today', desc: 'Two minutes, real results' },
                        ].map(step => (
                            <div key={step.num} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">{step.num}</p>
                                <p className="text-sm font-bold text-white mb-1">{step.label}</p>
                                <p className="text-[11px] text-white/30">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ARTICLE */}
            {featured && (
                <section className="px-6 sm:px-12 md:px-16 py-16 border-b border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-8 font-black">Latest Briefing</p>
                    <Link
                        href={`/intelligence/${featured.slug}`}
                        className="group block max-w-5xl"
                    >
                        <div
                            className="rounded-3xl border border-white/10 p-8 md:p-12 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                            style={{
                                background: `radial-gradient(ellipse at 80% 20%, ${featuredBranch?.color ?? '#3B82F6'}10, transparent 60%)`
                            }}
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div className="flex-1">
                                    <span
                                        className="inline-block text-[10px] px-3 py-1 rounded-full tracking-[0.2em] uppercase font-black border mb-6"
                                        style={{
                                            backgroundColor: `${featuredBranch?.color ?? '#3B82F6'}15`,
                                            color: featuredBranch?.color ?? '#3B82F6',
                                            borderColor: `${featuredBranch?.color ?? '#3B82F6'}30`,
                                        }}
                                    >
                                        {featured.branch}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 group-hover:text-white/80 transition-colors">
                                        {featured.title}
                                    </h2>
                                    <p className="text-white/40 text-base leading-relaxed max-w-xl">
                                        {featured.summary || featured.tldr || featured.excerpt}
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <div className="bg-black/50 border border-white/20 rounded-2xl px-6 py-4 font-mono mb-4">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Text this keyword →</span>
                                        <div className="flex items-center gap-2">
                                            <span>⚡</span>
                                            <span className="font-black tracking-widest text-lg" style={{ color: featuredBranch?.color ?? '#fff' }}>
                                                {featured.keyword}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors text-right">
                                        Read Briefing →
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* ALL ARTICLES */}
            <section className="px-6 sm:px-12 md:px-16 py-16">
                <div className="max-w-5xl mx-auto">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-10 font-black">
                        {rest.length > 0 ? 'All Briefings' : 'All Briefings'}
                    </p>
                    <IntelligenceList initialPosts={rest.length > 0 ? rest : allPosts} />
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="border-t border-white/5 px-6 sm:px-12 md:px-16 py-20 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 font-black">Get them on WhatsApp</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                    Read it here.<br />Run it on WhatsApp.
                </h2>
                <p className="text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
                    Sign up free. Text any keyword to receive the full step-by-step protocol instantly — no app, no login, no friction.
                </p>
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-black text-black bg-white hover:scale-105 transition-all duration-300 text-sm"
                >
                    Sign up free →
                </Link>
            </section>

        </main>
    );
}
