import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup?mode=login');
  }

  const [profileRes, favoritesRes, historyRes, toolsRes] = await Promise.all([
    supabase.from('users').select('*').eq('email', user.email).single(),
    supabase.from('user_favorites').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    supabase.from('assessment_history').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(20),
    supabase.from('tools').select('slug, branch, color'),
  ]);

  return (
    <DashboardClient
      profile={profileRes.data}
      initialFavorites={favoritesRes.data || []}
      initialHistory={historyRes.data || []}
      tools={toolsRes.data || []}
    />
  );
}
