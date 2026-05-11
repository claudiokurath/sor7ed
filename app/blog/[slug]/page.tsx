import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogPostClient from "@/components/BlogPostClient";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: article, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();

    if (error || !article) {
        console.error('Error fetching protocol:', error);
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20">
            <div className="max-w-3xl mx-auto">

                <Link href="/blog" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
                    ← Back to articles
                </Link>

                {/* Interactive Client Content (Read Aloud + Deep Dive) */}
                <BlogPostClient article={article} />

                {/* WhatsApp Protocol CTA */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-black mb-4">Get the full protocol on WhatsApp</h2>
                    <p className="text-white/50 mb-8 max-w-lg mx-auto">
                        The complete step-by-step protocol is delivered straight to your phone. Sign up for free, then text the keyword below.
                    </p>

                    <div className="bg-black/50 border border-white/20 rounded-2xl p-6 inline-block mb-8 min-w-[280px] font-mono">
                        <span className="text-white/40 text-xs uppercase tracking-widest block mb-2">Text this →</span>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-3xl">⚡</span>
                            <span className="text-4xl font-bold tracking-[0.2em] text-white uppercase">{article.keyword}</span>
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/signup"
                            className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300"
                        >
                            Sign up to receive protocols →
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
