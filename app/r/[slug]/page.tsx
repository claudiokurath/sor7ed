import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: link } = await supabase
        .from('rich_links')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();
        
    if (!link) return { title: 'Link Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
    const imageUrl = link.image_url || `${siteUrl}/Images/og-explore.png`;

    return {
        title: link.title,
        description: link.description || 'Visit SOR7ED',
        openGraph: {
            title: link.title,
            description: link.description || 'Visit SOR7ED',
            url: `${siteUrl}/r/${resolvedParams.slug}`,
            siteName: 'SOR7ED',
            images: [{ url: imageUrl, width: 1200, height: 630, alt: link.title }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: link.title,
            description: link.description || 'Visit SOR7ED',
            images: [imageUrl],
        },
    };
}

export default async function RichLinkPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: link, error } = await supabase
        .from('rich_links')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();

    if (error || !link) {
        console.error('Error fetching rich link:', error);
        notFound();
    }

    // Server-side click tracking
    try {
        await supabase.from('rich_link_clicks').insert({
            link_id: link.id,
            user_agent: 'Server Redirect' // In a real app, you might want to forward headers if available
        });
    } catch (e) {
        console.error('Failed to log click:', e);
    }

    // Perform the redirect
    redirect(link.target_url);
}
