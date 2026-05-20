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

interface DatabaseError {
  message?: string;
  code?: string;
  details?: string;
}

/**
 * Uses UTC to ensure consistent streak calculation regardless of server timezone.
 * Note: For true per-user timezone accuracy, move streak calculation to client-side.
 */
function getStartOfDayUTC(dateInput: string | Date): number {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function calculateStreak(history: HistoryRow[]): number {
  if (!history?.length) return 0;

  const activityDays = new Set(
    history.map(record => getStartOfDayUTC(record.completed_at))
  );

  const todayUTC = getStartOfDayUTC(new Date());
  const yesterdayUTC = todayUTC - MS_PER_DAY;

  const streakStartDay = activityDays.has(todayUTC)
    ? todayUTC
    : activityDays.has(yesterdayUTC)
      ? yesterdayUTC
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
  const weeklyActivity = Array<number>(7).fill(0);

  for (const record of history) {
    const daysDifference = Math.floor(
      (currentTime - new Date(record.completed_at).getTime()) / MS_PER_DAY
    );
    if (daysDifference >= 0 && daysDifference < 7) {
      weeklyActivity[6 - daysDifference]++;
    }
  }

  return weeklyActivity;
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === 'object' && error !== null;
}

function logDatabaseError(operation: string, error: unknown): void {
  const details = isDatabaseError(error)
    ? { message: error.message, code: error.code, details: error.details }
    : { message: String(error) };

  console.error(`[Dashboard] Failed to ${operation}:`, details);
}

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/signup?mode=login');
  }

  // Safe after redirect - Next.js redirect() throws internally
  const { id: userId } = user;

  const [
    { data: profile, error: profileError },
    { data: favorites, error: favoritesError },
    { data: history, error: historyError },
    { count: totalAssessments, error: countError },
    { data: tools, error: toolsError },
    { data: savedItems, error: savedItemsError },
  ] = await Promise.all([
    // ✅ Fixed: Explicit column selection for security
    supabase
      .from('users')
      .select('user_id, first_name, display_name, avatar_url, email, created_at, whatsapp_number, whatsapp_verified, wa_verify_code, weekly_opted_in, whatsapp_opted_out')
      .eq('user_id', userId)
      .single(),

    supabase
      .from('user_favorites')
      .select('id, item_type, item_slug, item_name, item_keyword, item_color, item_branch, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false }),

    // ✅ Fixed: Added 'id' to match HistoryRow interface
    supabase
      .from('assessment_history')
      .select('id, completed_at, tool_slug, tool_name, score, level, friction_type')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(HISTORY_LIMIT),

    // ✅ Fixed: Separate count query for accurate total
    supabase
      .from('assessment_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),

    supabase
      .from('tools')
      .select('slug, branch, color'),

    supabase
      .from('saved_items')
      .select('id, url, title, category, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
      .limit(SAVED_ITEMS_LIMIT),
  ]);

  // Log errors without blocking render
  if (profileError) logDatabaseError('load user profile', profileError);
  if (favoritesError) logDatabaseError('load favorites', favoritesError);
  if (historyError) logDatabaseError('load assessment history', historyError);
  if (countError) logDatabaseError('count total assessments', countError);
  if (toolsError) logDatabaseError('load tools', toolsError);
  if (savedItemsError) logDatabaseError('load saved items', savedItemsError);

  const safeHistory = (history ?? []) as HistoryRow[];

  const dashboardMeta = {
    currentStreak: calculateStreak(safeHistory),
    weeklyActivity: calculateWeeklyActivity(safeHistory),
    // ✅ Fixed: Uses actual count from database, not limited array length
    totalAssessments: totalAssessments ?? safeHistory.length,
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
