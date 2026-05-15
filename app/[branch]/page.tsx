// app/[branch]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TexturedBackground } from "@/components/TexturedBackground";
import { SORTED_ECOSYSTEM_BRANCHES, BranchKey } from "@/lib/unified-branches";
import { getBranches } from "@/lib/getBranches";
import { Metadata } from "next";
import IntelligenceStrip from '@/components/IntelligenceStrip';
import ToolStrip from '@/components/ToolStrip';

type BranchParams = {
  branch: string;
};

export async function generateMetadata({ 
  params 
}: { 
  params: BranchParams 
}): Promise<Metadata> {
  const branches = await getBranches();
  const branchInfo = branches.find(b => b.slug === params.branch);
  const ecosystemInfo = SORTED_ECOSYSTEM_BRANCHES[params.branch as BranchKey];

  if (!branchInfo) return { title: 'Branch Not Found | SOR7ED' };

  return {
    title: `${ecosystemInfo?.label || branchInfo.name} | SOR7ED`,
    description: ecosystemInfo?.tagline || branchInfo.description,
    openGraph: {
      title: `${ecosystemInfo?.label || branchInfo.name} | SOR7ED`,
      description: ecosystemInfo?.description || branchInfo.description,
    }
  };
}

export default async function BranchPage({ 
  params 
}: { 
  params: BranchParams 
}) {
  const branches = await getBranches();
  const branchInfo = branches.find(b => b.slug === params.branch);
  const ecosystemInfo = SORTED_ECOSYSTEM_BRANCHES[params.branch as BranchKey];

  if (!branchInfo) notFound();

  const supabase = await createClient();

  // ✅ PERFORMANCE: Parallel data fetching
  const [
    { data: protocols, error: pError },
    { data: tools, error: tError }
  ] = await Promise.all([
    supabase
      .from('protocols')
      .select('*')
      .eq('branch', branchInfo.name)
      .eq('status', 'Published')
      .order('created_at', { ascending: false }),
    supabase
      .from('tools')  
      .select('*')
      .eq('branch', branchInfo.name)
      .neq('status', 'Draft')
      .order('created_at', { ascending: false })
  ]);

  if (pError) console.error('Error fetching protocols:', pError);
  if (tError) console.error('Error fetching tools:', tError);

  const branchColor = ecosystemInfo?.color || branchInfo.color || '#ffd107';
  const hasContent = (protocols && protocols.length > 0) || (tools && tools.length > 0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 font-roboto font-thin">
      {/* ─── HERO WITH MIDJOURNEY TEXTURE ─── */}
      <TexturedBackground 
        texture="architecture" 
        intensityLevel="subtle"
        className="relative"
      >
        <section className="relative px-4 sm:px-6 md:px-16 py-20 max-w-7xl mx-auto z-30">
          {/* Branch color accent glow */}
          <div 
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: branchColor }}
          />

          <div className="flex flex-col items-start">
            {/* Branch icon */}
            {branchInfo.icon && (
              <span className="text-5xl md:text-7xl mb-8 block drop-shadow-lg">
                {branchInfo.icon}
              </span>
            )}

            {/* Branch name */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-anton tracking-wider mb-6 leading-[1.0] uppercase drop-shadow-xl">
              {ecosystemInfo?.label || branchInfo.name}
            </h1>

            {/* Founder voice tagline */}
            {ecosystemInfo?.tagline && (
              <p 
                className="text-2xl md:text-3xl font-anton tracking-wider mb-6 max-w-3xl leading-tight uppercase"
                style={{ color: branchColor }}
              >
                {ecosystemInfo.tagline}
              </p>
            )}

            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
              {ecosystemInfo?.description || branchInfo.description}
            </p>

            {/* Branch status */}
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-anton tracking-wider uppercase tracking-[0.3em] text-white/20">
                Branch Status
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse" 
                  style={{ backgroundColor: branchColor }} 
                />
                <span className="text-[10px] font-anton tracking-wider text-white/60 uppercase tracking-widest">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>
      </TexturedBackground>

      {/* ─── TOOLS STRIP ─── */}
      {tools && tools.length > 0 && (
        <div className="relative z-10 border-t border-white/5">
          <ToolStrip 
            tools={tools} 
            title={`${ecosystemInfo?.label || branchInfo.name} Diagnostics`}
            subtitle={`Find exactly what's broken in your ${(ecosystemInfo?.label || branchInfo.name).toLowerCase()} system.`}
          />
        </div>
      )}

      {/* ─── PROTOCOLS STRIP ─── */}
      {protocols && protocols.length > 0 && (
        <div className="relative z-10 border-t border-white/5">
          <IntelligenceStrip articles={protocols as any} />
        </div>
      )}

      {/* ─── EMPTY STATE ─── */}
      {!hasContent && (
        <BranchEmptyState 
          branchName={ecosystemInfo?.label || branchInfo.name}
          branchColor={branchColor}
        />
      )}

      {/* ─── FOUNDER VOICE CTA ─── */}
      <BranchCTA 
        branchName={ecosystemInfo?.label || branchInfo.name}
        branchColor={branchColor}
        tagline={ecosystemInfo?.tagline}
      />
    </main>
  );
}

// ─── EMPTY STATE COMPONENT ─────────────────────────────────────
function BranchEmptyState({ 
  branchName, 
  branchColor 
}: { 
  branchName: string; 
  branchColor: string;
}) {
  return (
    <section className="py-32 relative z-10 border-t border-white/5">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ 
            backgroundColor: `${branchColor}15`, 
            border: `1px solid ${branchColor}30` 
          }}
        >
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: branchColor }}
          />
        </div>
        
        <h3 className="text-xl font-anton tracking-wider text-white mb-3 uppercase">
          Building this one right now.
        </h3>
        <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          The {branchName} protocols are in progress. I'm writing them from experience, 
          not theory — so they take a bit longer to get right.
        </p>
        
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                     text-sm font-anton tracking-wider text-black transition-all 
                     hover:scale-105 duration-300 uppercase"
          style={{ backgroundColor: branchColor }}
        >
          See what's live →
        </Link>
      </div>
    </section>
  );
}

// ─── FOUNDER VOICE CTA ─────────────────────────────────────────
function BranchCTA({ 
  branchName, 
  branchColor,
  tagline
}: { 
  branchName: string; 
  branchColor: string;
  tagline?: string;
}) {
  return (
    <section className="py-32 px-4 sm:px-6 md:px-16 relative z-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[40px] p-8 sm:p-16 
                       flex flex-col md:flex-row items-center 
                       justify-between gap-12 text-center md:text-left
                       overflow-hidden group
                       bg-white/[0.02] border border-white/10">
          
          {/* Dynamic branch color glow */}
          <div 
            className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full blur-[100px] 
                       opacity-15 pointer-events-none transition-opacity duration-700 
                       group-hover:opacity-25"
            style={{ backgroundColor: branchColor }}
          />

          <div className="relative z-10">
            <p 
              className="text-[10px] font-anton tracking-wider uppercase tracking-[0.3em] mb-4"
              style={{ color: branchColor }}
            >
              Stop Reading. Start Fixing.
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-anton tracking-wider uppercase mb-4 tracking-tight leading-tight">
              Let's actually fix your<br />
              {branchName} system.
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-md leading-relaxed">
              {tagline 
                ? `${tagline} The diagnostic shows you what's broken. The WhatsApp protocol actually fixes it.`
                : `The diagnostic shows you what's broken. The WhatsApp protocol actually fixes it. Step-by-step, built for how your brain works.`
              }
            </p>
          </div>
          
          <Link
            href="/signup"
            className="relative z-10 shrink-0 inline-flex items-center 
                       px-10 py-5 rounded-full font-anton tracking-wider text-black 
                       hover:scale-105 transition-all duration-300 
                       text-sm whitespace-nowrap uppercase"
            style={{ 
              backgroundColor: branchColor,
              boxShadow: `0 0 30px ${branchColor}30`
            }}
          >
            Get WhatsApp Access →
          </Link>
        </div>
      </div>
    </section>
  );
}
