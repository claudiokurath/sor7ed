import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ToolAssessmentClient from "@/components/ToolAssessmentClient";
import { Metadata } from "next";
import { ConciergeWaitlistCTA } from "@/components/assessment/ConciergeWaitlistCTA";
import { branches } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    
    const { data: tool } = await supabase
        .from('tools')
        .select('name, description, tldr, branch')
        .eq('slug', resolvedParams.slug)
        .neq('status', 'Draft')
        .single();
        
    if (!tool) return { title: 'Assessment Not Found' };

    return {
        title: `${tool.name} | SOR7ED Assessment`,
        description: tool.description || tool.tldr || `Take the 2-minute ${tool.name} assessment in the ${tool.branch} branch.`,
    };
}

export default async function ToolPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ wa?: string, phone?: string, keyword?: string }> }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const supabase = await createClient();

    const { data: tool, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .neq('status', 'Draft')
        .single();

    if (error || !tool) {
        notFound();
    }

    const whatsappContext = resolvedSearchParams.wa === '1' ? {
        phone: resolvedSearchParams.phone || '',
        sourceKeyword: resolvedSearchParams.keyword || '',
        entryTime: new Date().toISOString()
    } : null;

    const branchInfo = branches.find(b => b.name === tool.branch);
    const branchColor = branchInfo?.color || '#ffffff';

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20 flex flex-col justify-center">
            <ToolAssessmentClient
                tool={tool}
                whatsappContext={whatsappContext}
            />
            <ConciergeWaitlistCTA
                branch={tool.branch}
                sourceToolSlug={resolvedParams.slug}
                branchColor={branchColor}
            />
        </main>
    );
}
