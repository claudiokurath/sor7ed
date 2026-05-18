import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IntelligenceClient from "@/components/IntelligenceClient";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: article } = await supabase
        .from('protocols')
        .select('title, problem, excerpt, description, branch, cover_image')
        .eq('slug', resolvedParams.slug)
        .eq('status', 'Published')
        .single();
        
    if (!article) return { title: 'Intelligence Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
    const pageUrl = `${siteUrl}/intelligence/${resolvedParams.slug}`;
    const description = article.problem || article.description || `Field Intelligence briefing on ${article.title}.`;
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
        <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto pt-16">
                {/* Interactive Field Intelligence Client */}
                <IntelligenceClient article={article} />
            </div>
        </main>
    );
}
