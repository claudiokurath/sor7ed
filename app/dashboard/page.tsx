import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup?mode=login');
  }

  const [profileRes, favoritesRes, historyRes, toolsRes, savedItemsRes] = await Promise.all([
    supabase.from('users').select('*').eq('user_id', user.id).single(),
    supabase.from('user_favorites').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    supabase.from('assessment_history').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(20),
    supabase.from('tools').select('slug, branch, color'),
    supabase.from('saved_items').select('id, url, title, category, saved_at').eq('user_id', user.id).order('saved_at', { ascending: false }).limit(100),
  ]);

  return (
    <DashboardClient
      profile={profileRes.data}
      initialFavorites={favoritesRes.data || []}
      initialHistory={historyRes.data || []}
      tools={toolsRes.data || []}
      initialSavedItems={savedItemsRes.data || []}
    />
  );
}
