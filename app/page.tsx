import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .neq('status', 'Draft')
        .order('created_at', { ascending: false })
        .limit(3);

    const { data: articles } = await supabase
        .from('protocols')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <div className="bg-[#0a0a0a]">
            <HomeClient tools={tools || []} user={user} articles={articles || []} />
        </div>
    );
}
