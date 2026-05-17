import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { branches } from "@/lib/constants";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
    if (!branchInfo) return { title: 'Branch Not Found' };

    const supabase = await createClient();
    const { data: dbBranch } = await supabase
        .from('branches')
        .select('cover_image')
        .eq('slug', resolvedParams.branch)
        .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
    const image = dbBranch?.cover_image;
    const description = `${branchInfo.description} — protocols delivered to your WhatsApp.`;

    return {
        title: `${branchInfo.name} | SOR7ED`,
        description,
        openGraph: {
            title: `${branchInfo.icon} ${branchInfo.name} | SOR7ED`,
            description,
            url: `${siteUrl}/${resolvedParams.branch}`,
            siteName: 'SOR7ED',
            ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: branchInfo.name }] } : {}),
            type: 'website',
        },
    };
}

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
    const resolvedParams = await params;
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
    if (!branchInfo) notFound();

    const supabase = await createClient();

    const [{ data: articles }, { data: tools }] = await Promise.all([
        supabase
            .from('protocols')
            .select('slug, title, excerpt, summary, cover_image, read_time')
            .eq('branch', branchInfo!.name)
            .eq('status', 'Published')
            .order('created_at', { ascending: false })
            .limit(12),
        supabase
            .from('tools')
            .select('slug, name, tldr, cover_image, color')
            .eq('branch', branchInfo!.name)
            .neq('status', 'Draft')
            .order('created_at', { ascending: false })
            .limit(12),
    ]);

    const color = branchInfo!.color;
    const hasContent = (articles?.length || 0) + (tools?.length || 0) > 0;

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            {/* Top Navigation Bar */}
            <header className="border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/explore"
                        className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors font-semibold"
                    >
                        ← All Branches
                    </Link>
                    <span className="text-xs uppercase tracking-widest text-white/20 font-bold">
                        SOR7ED
                    </span>
                    <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                        {(articles?.length || 0) + (tools?.length || 0)} Items
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row">
                {/* Sticky Sidebar */}
                <aside className="lg:w-80 lg:sticky lg:top-0 lg:h-screen border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div
                        className="absolute inset-0 opacity-20 blur-3xl"
                        style={{ background: `radial-gradient(circle at 20% 30%, ${color}, transparent 70%)` }}
                    />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
                        {/* Branch Identity */}
                        <div>
                            <div className="mb-8">
                                <div
                                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-2xl"
                                    style={{ 
                                        backgroundColor: `${color}15`, 
                                        border: `2px solid ${color}30`,
                                        boxShadow: `0 20px 60px ${color}20`
                                    }}
                                >
                                    {branchInfo!.icon}
                                </div>
                                
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-4">
                                    {branchInfo!.name}
                                </h1>
                                
                                <p className="text-white/50 text-lg leading-relaxed">
                                    {branchInfo!.description}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-sm font-medium text-white/60">Protocols</span>
                                    <span className="text-2xl font-black tabular-nums" style={{ color }}>
                                        {(articles?.length || 0).toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-white/60">Tools</span>
                                    <span className="text-2xl font-black tabular-nums" style={{ color }}>
                                        {(tools?.length || 0).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Always-Visible CTA */}
                        <div className="border-t border-white/10 pt-8">
                            <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">
                                Get Protocols
                            </p>
                            <Link
                                href="/signup"
                                className="flex items-center justify-between w-full text-black font-black text-base px-6 py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                                style={{ backgroundColor: color }}
                            >
                                <span>Join WhatsApp</span>
                                <span>→</span>
                            </Link>
                            <p className="text-xs text-white/30 mt-3 leading-relaxed">
                                Get new protocols delivered directly to your WhatsApp as they're published.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:max-w-none">
                    {/* Tools Section */}
                    {tools && tools.length > 0 && (
                        <section className="p-8 lg:p-16 border-b border-white/5">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-12">
                                <div
                                    className="w-1 h-8 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <div>
                                    <h2 className="text-xs uppercase tracking-[0.3em] font-black text-white/60 mb-1">
                                        Interactive Tools
                                    </h2>
                                    <p className="text-sm text-white/30">
                                        Assessments and calculators for immediate use
                                    </p>
                                </div>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            {/* Tools List */}
                            <div className="space-y-6">
                                {tools.map((tool, index) => (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="group flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-full sm:w-56 h-32 shrink-0 rounded-2xl overflow-hidden bg-[#0f0f0f] relative">
                                            {/* Index Number */}
                                            <span
                                                className="absolute top-3 right-3 text-xs font-black tabular-nums z-10 opacity-40"
                                                style={{ color }}
                                            >
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                            
                                            {tool.cover_image ? (
                                                <img
                                                    src={tool.cover_image}
                                                    alt={tool.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div 
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{ background: `linear-gradient(135deg, ${tool.color || color}20, transparent)` }}
                                                >
                                                    <span className="text-4xl opacity-20">{branchInfo!.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: tool.color || color }}
                                                />
                                                <span className="text-xs uppercase tracking-widest font-bold text-white/40">
                                                    Tool
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity">
                                                {tool.name}
                                            </h3>
                                            
                                            <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                                {tool.tldr}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Articles Section */}
                    {articles && articles.length > 0 && (
                        <section className="p-8 lg:p-16 border-b border-white/5">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-12">
                                <div
                                    className="w-1 h-8 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <div>
                                    <h2 className="text-xs uppercase tracking-[0.3em] font-black text-white/60 mb-1">
                                        Intelligence Protocols
                                    </h2>
                                    <p className="text-sm text-white/30">
                                        Structured briefings and step-by-step guides
                                    </p>
                                </div>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            {/* Articles List */}
                            <div className="space-y-6">
                                {articles.map((article, index) => (
                                    <Link
                                        key={article.slug}
                                        href={`/intelligence/${article.slug}`}
                                        className="group flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-full sm:w-56 h-32 shrink-0 rounded-2xl overflow-hidden bg-[#0f0f0f] relative">
                                            {/* Index Number */}
                                            <span
                                                className="absolute top-3 right-3 text-xs font-black tabular-nums z-10 opacity-40"
                                                style={{ color }}
                                            >
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                            
                                            {article.cover_image ? (
                                                <img
                                                    src={article.cover_image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div 
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}
                                                >
                                                    <span className="text-4xl opacity-20">{branchInfo!.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-white/30" />
                                                    <span className="text-xs uppercase tracking-widest font-bold text-white/40">
                                                        Protocol
                                                    </span>
                                                </div>
                                                {article.read_time && (
                                                    <span className="text-xs text-white/30 font-medium">
                                                        {article.read_time}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity">
                                                {article.title}
                                            </h3>
                                            
                                            <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                                {article.excerpt || article.summary}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {!hasContent && (
                        <section className="p-8 lg:p-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
                            <div
                                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-8 opacity-20"
                                style={{ backgroundColor: `${color}10` }}
                            >
                                {branchInfo!.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white/60 mb-4">
                                Intelligence Incoming
                            </h3>
                            <p className="text-white/30 max-w-md leading-relaxed mb-8">
                                Protocols and tools for this branch are currently being developed. 
                                Join the waitlist to get early access.
                            </p>
                            <div
                                className="w-20 h-px mb-8"
                                style={{ backgroundColor: `${color}40` }}
                            />
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
