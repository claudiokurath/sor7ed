import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AmbientBackground from '@/components/AmbientBackground';
import { SORTED_ECOSYSTEM_BRANCHES, BranchKey } from "@/lib/unified-branches";
import { getBranches } from "@/lib/getBranches";
import { Metadata } from "next";
import IntelligenceStrip from '@/components/IntelligenceStrip';
import ToolStrip from '@/components/ToolStrip';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const branches = await getBranches();
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
    const ecosystemInfo = SORTED_ECOSYSTEM_BRANCHES[resolvedParams.branch as BranchKey];

    if (!branchInfo) return { title: 'Branch Not Found' };

    return {
        title: `${branchInfo.name} | SOR7ED`,
        description: ecosystemInfo?.description || branchInfo.description,
    };
}

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
    const resolvedParams = await params;
    const branches = await getBranches();
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
    const ecosystemInfo = SORTED_ECOSYSTEM_BRANCHES[resolvedParams.branch as BranchKey];

    if (!branchInfo) notFound();

    const supabase = await createClient();

    const { data: protocols, error: pError } = await supabase
        .from('protocols')
        .select('*')
        .eq('branch', branchInfo.name)
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    const { data: tools, error: tError } = await supabase
        .from('tools')
        .select('*')
        .eq('branch', branchInfo.name)
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

    if (pError || tError) {
        console.error('Error fetching branch content:', pError || tError);
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
            <AmbientBackground color={branchInfo.color} intensity="medium" />
            
            {/* Header / Nav */}
            <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16 z-50">
                <Link href="/" className="opacity-40 hover:opacity-100 transition-opacity">
                    <Image src="/Images/Logo2026.png" alt="SOR7ED" width={180} height={72} className="h-14 w-auto" />
                </Link>
                <Link href="/" className="text-white/30 text-xs tracking-widest uppercase hover:text-white transition-colors">
                    ← Branches
                </Link>
            </div>

            <section className="relative pt-40 pb-20 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto z-10">
                <div className="flex flex-col items-start">
                    <span className="text-5xl md:text-7xl mb-8">{branchInfo.icon}</span>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.0] uppercase">
                      {ecosystemInfo?.label || branchInfo.name}
                    </h1>
                    <p className="text-[#ffd107] text-2xl md:text-3xl font-bold mb-4 max-w-2xl leading-tight">
                      {ecosystemInfo?.tagline}
                    </p>
                    <p className="text-white/50 text-xl md:text-2xl max-w-2xl leading-relaxed mb-12" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}>
                        {ecosystemInfo?.description || branchInfo.description}
                    </p>
                    
                    <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Branch Status</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: branchInfo.color }} />
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOOLS STRIP */}
            {tools && tools.length > 0 && (
                <div className="relative z-10">
                    <ToolStrip 
                        tools={tools} 
                        title={`${branchInfo.name} Tactical Tools`}
                        subtitle={`Specific assessments to calibrate your ${branchInfo.name.toLowerCase()} systems.`}
                    />
                </div>
            )}

            {/* PROTOCOLS STRIP */}
            {protocols && protocols.length > 0 && (
                <div className="relative z-10">
                    <IntelligenceStrip articles={protocols as any} />
                </div>
            )}

            {/* Empty State */}
            {(!protocols || protocols.length === 0) && (!tools || tools.length === 0) && (
                <section className="py-32 text-center relative z-10">
                    <p className="text-white/20 text-lg italic">No content available for this branch yet.</p>
                </section>
            )}

            {/* FOOTER CTA */}
            <section className="py-32 px-4 sm:px-6 md:px-16 relative z-10 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 sm:p-16 flex flex-col sm:flex-row items-center justify-between gap-12 text-center sm:text-left overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
                                Want {branchInfo.name} protocols<br />delivered on WhatsApp?
                            </h2>
                            <p className="text-white/40 text-base sm:text-lg max-w-md">
                                Secure, instant, and frictionless. One protocol for every problem.
                            </p>
                        </div>
                        
                        <Link
                            href="/signup"
                            className="relative z-10 shrink-0 inline-flex items-center px-10 py-5 rounded-full font-black text-black bg-white hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
                        >
                            Sign up for free →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
