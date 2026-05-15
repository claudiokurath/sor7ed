import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import IntelligenceGrid from "@/components/IntelligenceGrid";
import { getBranches } from "@/lib/getBranches";

export const metadata: Metadata = {
  title: "Field Intelligence | SOR7ED",
  description: "The theory behind the chaos. Why your brain works the way it does, why systems keep failing, and what actually helps.",
  openGraph: {
    title: "Field Intelligence | SOR7ED", 
    description: "Notes from someone who's actually been in the mess.",
  },
};

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
  const branches = await getBranches();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 font-roboto font-thin">
      {/* ─── HERO WITH MIDJOURNEY TEXTURE ─── */}
      <section className="relative px-5 py-20 max-w-6xl mx-auto overflow-hidden rounded-[32px] mb-14 border border-white/5">
        {/* Midjourney texture layer */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-screen">
          <Image 
            src="/textures/research-hyperfocus.jpg" 
            alt="Deep research mode" 
            fill 
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
        
        {/* Premium Noir overlay system */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />

        <div className="relative z-20 max-w-4xl">
          {/* Founder authenticity badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#ffd107] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffd107]/80 font-anton tracking-wider">
              Field Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-anton tracking-wider leading-[1.1] mb-8 uppercase">
            <span className="text-white block">The theory behind</span>
            <span className="text-[#ffd107] block">the chaos.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
            Why your brain works the way it does, why generic systems keep failing, 
            and what actually helps. No clinical jargon. No judgment.
          </p>

          <p className="text-white/40 text-sm leading-relaxed max-w-2xl">
            Just notes from someone who's actually been in the mess — the 3 AM 
            hyperfocus sessions, the subscription amnesia, the "I'll reply later" 
            that becomes three months. Turned into protocols you can steal.
          </p>

          {/* Stats if we have content */}
          {allPosts.length > 0 && (
            <div className="flex items-center gap-6 mt-10">
              <div>
                <span className="text-2xl font-anton tracking-wider text-[#ffd107]">
                  {allPosts.length}
                </span>
                <span className="text-white/30 text-[10px] ml-2 uppercase tracking-widest font-anton tracking-wider">
                  Briefings
                </span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div>
                <span className="text-2xl font-anton tracking-wider text-[#ffd107]">7</span>
                <span className="text-white/30 text-[10px] ml-2 uppercase tracking-widest font-anton tracking-wider">
                  Life Systems
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTENT SECTION ─── */}
      {allPosts.length > 0 ? (
        <section className="px-5 pb-20 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-anton tracking-wider shrink-0">
              All Briefings
            </p>
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] text-white/15 font-anton tracking-wider uppercase shrink-0">
              {allPosts.length}
            </span>
          </div>
          <IntelligenceGrid posts={allPosts} branches={branches} />
        </section>
      ) : (
        <EmptyIntelligenceState />
      )}

      {/* ─── HONEST CTA ─── */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 sm:p-12 
                         flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 
                         relative overflow-hidden">
            
            {/* Subtle glow effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ffd107]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#ffd107] mb-4 font-anton tracking-wider">
                Stop Reading. Start Doing.
              </p>
              <h2 className="text-2xl sm:text-3xl font-anton tracking-wider uppercase tracking-tight mb-3">
                Want the actual solution?
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-md">
                These articles explain why it's broken. The WhatsApp protocols 
                actually fix it. No new apps to manage. Just text the keyword 
                and get the step-by-step system.
              </p>
            </div>
            
            <Link
              href="/signup"
              className="relative z-10 shrink-0 inline-flex items-center px-8 py-4 rounded-full 
                         font-anton tracking-wider text-black bg-[#ffd107] hover:bg-white hover:scale-105 
                         transition-all duration-300 text-sm whitespace-nowrap 
                         shadow-[0_0_20px_rgba(255,209,7,0.2)] uppercase"
            >
              Get WhatsApp Access →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── EMPTY STATE COMPONENT ─────────────────────────────────────
function EmptyIntelligenceState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-5">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <span className="text-2xl">🧠</span>
      </div>
      <h3 className="text-lg font-anton tracking-wider text-white mb-3 uppercase">
        Briefings incoming.
      </h3>
      <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-8">
        I'm writing the first batch right now. Real insights from the trenches, 
        not recycled productivity advice.
      </p>
      <Link
        href="/signup"
        className="inline-flex items-center px-6 py-3 rounded-full 
                   font-anton tracking-wider text-black bg-[#ffd107] text-sm hover:scale-105 
                   transition-all duration-300 uppercase"
      >
        Notify me when they drop →
      </Link>
    </div>
  );
}
