import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SOR7ED",
  description: "Your intelligence profile — track assessments, saved protocols, and progress across all 7 branches.",
};

type HistoryRow = { completed_at: string };

function calculateStreak(history: HistoryRow[]): number {
  if (history.length === 0) return 0;

  const activityDays = new Set(
    history.map(h => {
      const d = new Date(h.completed_at);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    })
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  const start = activityDays.has(today) ? today : activityDays.has(yesterday) ? yesterday : null;
  if (!start) return 0;

  let streak = 0;
  let check = start;
  while (activityDays.has(check)) {
    streak++;
    check -= 86400000;
  }
  return streak;
}

function calculateWeeklyActivity(history: HistoryRow[]): number[] {
  const now = new Date();
  const weekly = Array(7).fill(0);
  history.forEach(h => {
    const diffDays = Math.floor((now.getTime() - new Date(h.completed_at).getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) weekly[6 - diffDays]++;
  });
  return weekly;
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/signup?mode=login');

  const [profileRes, favoritesRes, historyRes, toolsRes, savedItemsRes] = await Promise.all([
    supabase.from('users').select('*').eq('user_id', user.id).single(),
    supabase.from('user_favorites').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    supabase.from('assessment_history').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(20),
    supabase.from('tools').select('slug, branch, color'),
    supabase.from('saved_items').select('id, url, title, category, saved_at').eq('user_id', user.id).order('saved_at', { ascending: false }).limit(100),
  ]);

  const history = historyRes.data || [];

  const dashboardMeta = {
    currentStreak: calculateStreak(history),
    weeklyActivity: calculateWeeklyActivity(history),
    totalAssessments: history.length,
  };

  return (
    <DashboardClient
      profile={profileRes.data}
      initialFavorites={favoritesRes.data || []}
      initialHistory={history}
      tools={toolsRes.data || []}
      initialSavedItems={savedItemsRes.data || []}
      dashboardMeta={dashboardMeta}
    />
  );
}
