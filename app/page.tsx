import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['Live', 'Published'])
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching tools for homepage:', error);
    }

    return <HomeClient tools={tools || []} user={user} />;
}
