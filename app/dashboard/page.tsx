import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SOR7ED",
  description: "Your intelligence profile — track assessments, saved protocols, and progress across all 7 branches.",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const HISTORY_LIMIT = 20;
const SAVED_ITEMS_LIMIT = 100;

interface HistoryRow {
  id: string;
  completed_at: string;
  tool_slug: string;
  tool_name: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  friction_type?: string;
}

function getStartOfDayTimestamp(dateInput: string | Date): number {
  const date = new Date(dateInput);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function calculateStreak(history: HistoryRow[]): number {
  if (!history?.length) return 0;

  const activityDays = new Set(
    history.map(record => getStartOfDayTimestamp(record.completed_at))
  );

  const todayTimestamp = getStartOfDayTimestamp(new Date());
  const yesterdayTimestamp = todayTimestamp - MS_PER_DAY;

  const streakStartDay = activityDays.has(todayTimestamp)
    ? todayTimestamp
    : activityDays.has(yesterdayTimestamp)
      ? yesterdayTimestamp
      : null;

  if (!streakStartDay) return 0;

  let streakLength = 0;
  let currentDay = streakStartDay;

  while (activityDays.has(currentDay)) {
    streakLength++;
    currentDay -= MS_PER_DAY;
  }

  return streakLength;
}

function calculateWeeklyActivity(history: HistoryRow[]): number[] {
  if (!history?.length) return Array(7).fill(0);

  const currentTime = Date.now();
  const weeklyActivity = Array(7).fill(0);

  history.forEach(record => {
    const daysDifference = Math.floor(
      (currentTime - new Date(record.completed_at).getTime()) / MS_PER_DAY
    );
    if (daysDifference >= 0 && daysDifference < 7) {
      weeklyActivity[6 - daysDifference]++;
    }
  });

  return weeklyActivity;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logDatabaseError(operation: string, error: any): void {
  console.error(`Dashboard: Failed to ${operation}:`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
  });
}

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/signup?mode=login');
  }

  const userId = user!.id;

  const [
    { data: profile, error: profileError },
    { data: favorites, error: favoritesError },
    { data: history, error: historyError },
    { data: tools, error: toolsError },
    { data: savedItems, error: savedItemsError },
  ] = await Promise.all([
    supabase.from('users').select('*').eq('user_id', userId).single(),
    supabase.from('user_favorites').select('*').eq('user_id', userId).order('saved_at', { ascending: false }),
    supabase.from('assessment_history').select('completed_at, tool_slug, tool_name, score, level, friction_type').eq('user_id', userId).order('completed_at', { ascending: false }).limit(HISTORY_LIMIT),
    supabase.from('tools').select('slug, branch, color'),
    supabase.from('saved_items').select('id, url, title, category, saved_at').eq('user_id', userId).order('saved_at', { ascending: false }).limit(SAVED_ITEMS_LIMIT),
  ]);

  if (profileError) logDatabaseError('load user profile', profileError);
  if (favoritesError) logDatabaseError('load favorites', favoritesError);
  if (historyError) logDatabaseError('load assessment history', historyError);
  if (toolsError) logDatabaseError('load tools', toolsError);
  if (savedItemsError) logDatabaseError('load saved items', savedItemsError);

  const safeHistory = (history ?? []) as HistoryRow[];

  const dashboardMeta = {
    currentStreak: calculateStreak(safeHistory),
    weeklyActivity: calculateWeeklyActivity(safeHistory),
    totalAssessments: safeHistory.length,
  };

  return (
    <DashboardClient
      profile={profile}
      initialFavorites={favorites ?? []}
      initialHistory={safeHistory}
      tools={tools ?? []}
      initialSavedItems={savedItems ?? []}
      dashboardMeta={dashboardMeta}
    />
  );
}
