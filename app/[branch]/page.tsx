import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AmbientBackground from '@/components/AmbientBackground';

import { branches } from "@/lib/constants";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
    
    if (!branchInfo) return { title: 'Branch Not Found' };

    return {
        title: `${branchInfo.name} | SOR7ED Branch`,
        description: branchInfo.description,
    };
}

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
    const resolvedParams = await params;
    const branchInfo = branches.find(b => b.slug === resolvedParams.branch);

    if (!branchInfo) notFound();

    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('branch', branchInfo.name)
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching branch protocols:', error);
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20 relative overflow-hidden">
            <AmbientBackground color={branchInfo.color} intensity="low" />
            
            <div className="relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
                        ← Back to branches
                    </Link>

                    <h1 className="text-5xl md:text-7xl font-black mb-4">{branchInfo.name}</h1>
                    <p className="text-white/50 text-lg mb-16 max-w-xl">{branchInfo.description}</p>

                    <div className="space-y-4 mb-20">
                        <p className="text-white/30 text-xs tracking-widest uppercase mb-6">Protocols & Tools</p>

                        {posts?.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/intelligence/${post.slug}`}
                                className="border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:bg-white/5 transition-all group"
                            >
                                <div>
                                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70 mb-2 inline-block">Article</span>
                                    <h3 className="text-lg font-bold group-hover:text-white/80 transition-colors">{post.title}</h3>
                                    <p className="text-white/50 text-sm">{post.excerpt || post.description}</p>
                                </div>
                                <div className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 font-mono min-w-[140px]">
                                    <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">Text this →</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⚡</span>
                                        <span className="font-bold tracking-widest uppercase">{post.keyword}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {(!posts || posts.length === 0) && (
                            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                                <p className="text-white/30 italic">No protocols found for this branch yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-16 text-center">
                        <h2 className="text-3xl font-black mb-4">Want {branchInfo.name} protocols on WhatsApp?</h2>
                        <p className="text-white/50 mb-8 max-w-md mx-auto">
                            Sign up free, then text any keyword to get the step-by-step protocol instantly.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300"
                        >
                            Sign up for free →
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
