// app/tools/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { BranchGrid } from '@/components/BranchGrid';
import { SITE_COPY } from '@/lib/copy-matrix';
import { TexturedBackground } from '@/components/TexturedBackground';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Lab | SOR7ED',
  description: "Short, honest diagnostics across 7 parts of your life. No judgment, just useful information about what's actually going on.",
};

async function getLabStats() {
  try {
    const supabase = await createClient();
    
    const [
      { count: totalTools },
      { count: totalCompletions }
    ] = await Promise.all([
      supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'Draft'),
      supabase
        .from('assessment_results')
        .select('*', { count: 'exact', head: true })
    ]);

    return {
      totalTools: totalTools || 0,
      totalCompletions: totalCompletions || 0
    };
  } catch (error) {
    console.error('Error fetching lab stats:', error);
    return { totalTools: 0, totalCompletions: 0 };
  }
}

export default async function ToolsPage() {
  const stats = await getLabStats();

  return (
    <main className="bg-black text-white min-h-screen pt-20 font-roboto font-thin">
      {/* ─── HERO WITH MIDJOURNEY TEXTURE ─── */}
      <TexturedBackground
        texture="research" 
        intensityLevel="subtle"
        className="relative border-b border-white/5"
      >
        <section className="px-6 py-20 md:py-28 relative z-30">
          <div className="max-w-5xl mx-auto">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                           bg-white/5 border border-white/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#ffd107] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-anton tracking-wider">
                Diagnostic Systems Online
              </span>
            </div>

            {/* Founder Voice Headline */}
            <h1 className="text-4xl md:text-6xl font-anton tracking-wider mb-6 tracking-tight 
                          leading-[1.05] drop-shadow-xl uppercase">
              {SITE_COPY.lab.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-8 
                         leading-relaxed drop-shadow-lg">
              {SITE_COPY.lab.tagline}
            </p>

            {/* Founder authenticity note */}
            <p className="text-white/40 text-sm max-w-2xl leading-relaxed mb-10">
              Every tool here is something I built because I needed it first. 
              Short, honest diagnostics across 7 parts of life — no judgment, 
              just useful data about what's actually going on.
            </p>

            {/* Live Stats */}
            {stats.totalCompletions > 0 && (
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-anton tracking-wider text-white tabular-nums uppercase">
                    {stats.totalCompletions.toLocaleString()}
                  </span>
                  <span className="text-white/30 text-[10px] uppercase tracking-widest font-anton tracking-wider">
                    Diagnostics completed
                  </span>
                </div>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-anton tracking-wider text-white tabular-nums uppercase">7</span>
                  <span className="text-white/30 text-[10px] uppercase tracking-widest font-anton tracking-wider">
                    Life systems mapped
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </TexturedBackground>

      {/* ─── BRANCH GRID SECTION ─── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-anton tracking-wider shrink-0">
            Pick a branch
          </p>
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] text-white/15 font-anton tracking-wider uppercase shrink-0">
            7 systems
          </span>
        </div>

        <Suspense fallback={<BranchGridSkeleton />}>
          <BranchGrid />
        </Suspense>
      </section>

      {/* ─── FOUNDER VOICE PREMIUM CTA ─── */}
      <section className="border-t border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[40px] p-8 sm:p-16 
                         flex flex-col items-center text-center 
                         overflow-hidden group
                         bg-white/[0.02] border border-white/10">
            
            {/* Dynamic glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                           w-96 h-96 rounded-full blur-[100px] opacity-10 
                           pointer-events-none transition-opacity duration-700 
                           group-hover:opacity-20 bg-[#ffd107]" />

            <div className="relative z-10">
              {/* Founder badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                             bg-white/5 border border-white/10 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#ffd107] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-anton tracking-wider">
                  From the founder
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-anton tracking-wider mb-6 tracking-tight leading-tight uppercase">
                {SITE_COPY.premium.title}
              </h2>
              
              <p className="text-white/50 mb-4 max-w-lg mx-auto text-lg leading-relaxed">
                {SITE_COPY.premium.tagline}
              </p>

              {/* Honest founder note */}
              <p className="text-white/30 text-sm mb-10 max-w-md mx-auto leading-relaxed italic font-roboto font-thin">
                "I built these because I needed them. The protocols are from experience, 
                not theory. Some of them took me years to figure out."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#ffd107] text-black 
                           font-anton tracking-wider px-10 py-5 rounded-full hover:scale-105 
                           transition-all duration-300 text-sm uppercase
                           shadow-[0_0_30px_rgba(255,209,7,0.2)]"
                >
                  Start Free Trial →
                </Link>
                <Link
                  href="/intelligence"
                  className="inline-flex items-center gap-2 text-white/40 
                           hover:text-white/70 transition-colors text-sm font-anton tracking-wider
                           underline underline-offset-4 uppercase"
                >
                  Read the theory first →
                </Link>
              </div>

              <p className="text-[10px] text-white/20 mt-6 uppercase tracking-widest">
                {SITE_COPY.premium.trial}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BranchGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 
                     animate-pulse"
        />
      ))}
    </div>
  );
}
