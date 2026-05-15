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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero */}
            <div className="relative border-b border-white/5 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 blur-3xl"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}, transparent 70%)` }}
                />
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 pt-28">
                    <Link href="/explore" className="text-white/30 text-sm hover:text-white transition-colors mb-10 block">
                        ← All branches
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{branchInfo!.icon}</span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color }}>
                            {branchInfo!.name}
                        </h1>
                    </div>
                    <p className="text-white/50 text-xl max-w-xl mt-4">{branchInfo!.description}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

                {/* Tools */}
                {tools && tools.length > 0 && (
                    <section>
                        <div className="flex items-baseline gap-3 mb-8">
                            <h2 className="text-2xl font-black tracking-tight">Tools</h2>
                            <span className="text-white/20 text-sm">Interactive assessments</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.slug}
                                    href={`/tools/${tool.slug}`}
                                    className="group rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 bg-[#0f0f0f]"
                                >
                                    <div className="h-44 overflow-hidden bg-white/5">
                                        {tool.cover_image ? (
                                            <img
                                                src={tool.cover_image}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${tool.color || color}20, transparent)` }}>
                                                <span className="text-5xl opacity-20">{branchInfo!.icon}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 inline-block" style={{ backgroundColor: `${color}20`, color }}>
                                            Tool
                                        </span>
                                        <h3 className="text-lg font-black mb-2 group-hover:text-white/80 transition-colors leading-tight">
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

                {/* Articles */}
                {articles && articles.length > 0 && (
                    <section>
                        <div className="flex items-baseline gap-3 mb-8">
                            <h2 className="text-2xl font-black tracking-tight">Intelligence</h2>
                            <span className="text-white/20 text-sm">Protocols & briefings</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/intelligence/${article.slug}`}
                                    className="group rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 bg-[#0f0f0f]"
                                >
                                    <div className="h-44 overflow-hidden bg-white/5">
                                        {article.cover_image ? (
                                            <img
                                                src={article.cover_image}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}>
                                                <span className="text-5xl opacity-20">{branchInfo!.icon}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                                                Article
                                            </span>
                                            {article.read_time && (
                                                <span className="text-xs text-white/25 font-bold uppercase tracking-widest">
                                                    {article.read_time}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black mb-2 group-hover:text-white/80 transition-colors leading-tight">
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

                {(!articles?.length && !tools?.length) && (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-white/30">Protocols coming soon for this branch.</p>
                    </div>
                )}

                {/* CTA */}
                <div className="border-t border-white/5 pt-16 text-center">
                    <p className="text-white/30 text-sm mb-6">Get these protocols delivered to WhatsApp</p>
                    <Link
                        href="/signup"
                        className="inline-block text-black font-bold px-10 py-4 rounded-full hover:opacity-90 transition-all"
                        style={{ backgroundColor: color }}
                    >
                        Sign up free →
                    </Link>
                </div>
            </div>
        </div>
    );
}
