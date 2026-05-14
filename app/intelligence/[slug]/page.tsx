import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IntelligenceClient from "@/components/IntelligenceClient";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: article } = await supabase
        .from('protocols')
        .select('title, problem, description, branch')
        .eq('slug', resolvedParams.slug)
        .eq('status', 'Published')
        .single();
        
    if (!article) return { title: 'Intelligence Not Found' };

    return {
        title: `${article.title} | Field Intelligence`,
        description: article.problem || article.description || `Field Intelligence briefing on ${article.title}.`,
    };
}

export default async function IntelligenceBriefing({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: article, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .eq('status', 'Published')
        .single();

    if (error || !article) {
        console.error('Error fetching protocol:', error);
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto pt-16">
                {/* Interactive Field Intelligence Client */}
                <IntelligenceClient article={article} />
            </div>
        </main>
    );
}
