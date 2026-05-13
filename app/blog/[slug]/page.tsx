import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogPostClient from "@/components/BlogPostClient";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: article } = await supabase
        .from('protocols')
        .select('title, problem, description, branch')
        .eq('slug', resolvedParams.slug)
        .neq('status', 'Draft')
        .single();
        
    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | SOR7ED`,
        description: article.problem || article.description || `Read about ${article.title} in the ${article.branch} branch.`,
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: article, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .neq('status', 'Draft')
        .single();

    if (error || !article) {
        console.error('Error fetching protocol:', error);
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20">
            <div className="max-w-3xl mx-auto pt-16">
                {/* Interactive Client Content (Read Aloud + Deep Dive + Dynamic CTA) */}
                <BlogPostClient article={article} />
            </div>
        </main>
    );
}
