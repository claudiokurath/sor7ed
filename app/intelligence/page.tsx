import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import IntelligenceGrid from "@/components/IntelligenceGrid";
import { getBranches } from "@/lib/getBranches";

export default async function IntelligencePage() {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    if (error) console.error('Error fetching protocols:', error);

    const allPosts = posts || [];
    const branches = await getBranches();

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">

            {/* NAV */}
            <div className="px-5 pt-8 pb-0 flex justify-between items-center max-w-6xl mx-auto">
                <Link href="/" className="flex items-center gap-2 opacity-25 hover:opacity-60 transition-opacity">
                    <span className="text-white text-sm">←</span>
                    <Image src="/Images/Logo2026.png" alt="SOR7ED" width={180} height={72} className="h-16 w-auto" />
                </Link>
                <Link href="/signup" className="text-white/30 text-[10px] tracking-widest uppercase font-medium hover:text-white transition-colors">
                    Sign In
                </Link>
            </div>

            {/* HERO */}
            <section className="px-5 pt-14 pb-14 max-w-6xl mx-auto">
                <div className="max-w-4xl mb-10">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
                        <span className="text-white block">The world wasn&apos;t built for your brain.</span>
                        <span className="text-[#ffd107] block">We build systems that are.</span>
                    </h1>
                    <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-3xl">
                        ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software. SOR7ED is that software, delivered one protocol at a time.
                    </p>
                </div>
            </section>

            <div className="border-t border-white/5" />

            {/* ARTICLE GRID */}
            {allPosts.length > 0 && (
                <section className="px-5 pb-20 max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-black shrink-0">All Briefings</p>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[9px] text-white/15 font-bold uppercase shrink-0">{allPosts.length}</span>
                    </div>
                    <IntelligenceGrid posts={allPosts} branches={branches} />
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
