import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";
import IntelligenceStrip from "@/components/IntelligenceStrip";

export default async function Home() {
    const supabase = await createClient();
    const { data: articles } = await supabase
        .from('protocols')
        .select('slug, title, branch, tldr, excerpt, summary, cover_image, read_time, level')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(8);

    return (
        <div className="bg-[#0a0a0a]">
            <HomeClient />
            <IntelligenceStrip articles={articles || []} />
        </div>
    );
}
