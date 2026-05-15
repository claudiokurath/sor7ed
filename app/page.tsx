import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
    const supabase = await createClient();

    const [{ data: tools }, { data: articles }] = await Promise.all([
        supabase
            .from('tools')
            .select('slug, name, tldr, cover_image, color, branch')
            .neq('status', 'Draft')
            .order('created_at', { ascending: false })
            .limit(6),
        supabase
            .from('protocols')
            .select('slug, title, excerpt, summary, cover_image, read_time, branch')
            .eq('status', 'Published')
            .order('created_at', { ascending: false })
            .limit(6),
    ]);

    return <HomeClient tools={tools || []} articles={articles || []} />;
}
