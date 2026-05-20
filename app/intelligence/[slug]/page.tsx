import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IntelligenceClient from "@/components/IntelligenceClient";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: article } = await supabase
        .from('protocols')
        .select('title, problem, excerpt, description, branch, cover_image, meta_description')
        .eq('slug', resolvedParams.slug)
        .eq('status', 'Published')
        .single();
        
    if (!article) return { title: 'Intelligence Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
    const pageUrl = `${siteUrl}/intelligence/${resolvedParams.slug}`;
    const description = article.meta_description || article.problem || article.description || `Field Intelligence briefing on ${article.title}.`;
    const image = article.cover_image || `${siteUrl}/Images/og-explore.png`;

    return {
        title: `${article.title} | SOR7ED`,
        description,
        openGraph: {
            title: article.title,
            description,
            url: pageUrl,
            siteName: 'SOR7ED',
            images: [{ url: image, width: 1500, height: 600, alt: article.title }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
            images: [image],
        },
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
        <main className="min-h-screen bg-[#080f11] text-white px-4 sm:px-6 py-16 sm:py-20 relative overflow-hidden transition-colors duration-500">
            {/* Cinematic ambient background glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff7a45]/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto pt-16 relative z-10">
                {/* Interactive Field Intelligence Client */}
                <IntelligenceClient article={article} />
            </div>
        </main>
    );
}
