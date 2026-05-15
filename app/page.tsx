import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";
import { getBranches } from "@/lib/getBranches";

export const revalidate = 60;

export default async function Home() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const [{ data: allTools }, { data: articles }, branches] = await Promise.all([
        supabase.from('tools').select('*').neq('status', 'Draft').order('created_at', { ascending: false }),
        supabase.from('protocols').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(6),
        getBranches()
    ]);

    const tools = branches.map(branch => {
        return allTools?.find(t => t.branch === branch.name) || allTools?.find(t => t.branch === branch.slug);
    }).filter(Boolean);

    return (
        <div className="bg-black">
            <HomeClient tools={tools || []} user={user} articles={articles || []} branches={branches} />
        </div>
    );
}
