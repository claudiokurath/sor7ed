import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Dashboard | SOR7ED",
	description: "Your personal dashboard — track assessments, saved protocols, and progress across all 7 branches.",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const HISTORY_LIMIT = 20;
const SAVED_ITEMS_LIMIT = 100;

type HistoryLevel = "low" | "medium" | "high" | "critical";
type HistoryRow = {
	id: string;
	completed_at: string;
	tool_slug: string;
	tool_name: string;
	score: number;
	level: HistoryLevel;
	friction_type: string | null;
};

type DbErrorLike = { message?: string; code?: string; details?: string } | null;

function logDbError(operation: string, error: DbErrorLike) {
	if (!error) return;
	console.error(`[Dashboard] ${operation} failed`, {
		message: error.message,
		code: error.code,
		details: error.details,
	});
}

function startOfDayUTC(input: string | Date): number | null {
	const d = new Date(input);
	const t = d.getTime();
	if (!Number.isFinite(t)) return null;
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function calculateStreak(history: HistoryRow[]): number {
	if (history.length === 0) return 0;
	const days = new Set<number>();
	for (const r of history) {
		const day = startOfDayUTC(r.completed_at);
		if (day !== null) days.add(day);
	}
	const today = startOfDayUTC(new Date());
	if (today === null) return 0;
	const yesterday = today - MS_PER_DAY;
	const start = days.has(today) ? today : days.has(yesterday) ? yesterday : null;
	if (start === null) return 0;
	let streak = 0;
	for (let day = start; days.has(day); day -= MS_PER_DAY) streak++;
	return streak;
}

function calculateWeeklyActivity(history: HistoryRow[]): number[] {
	const result = Array<number>(7).fill(0);
	if (history.length === 0) return result;
	const now = Date.now();
	for (const r of history) {
		const t = new Date(r.completed_at).getTime();
		if (!Number.isFinite(t)) continue;
		const daysAgo = Math.floor((now - t) / MS_PER_DAY);
		if (daysAgo >= 0 && daysAgo < 7) {
			result[6 - daysAgo] += 1;
		}
	}
	return result;
}

export default async function Dashboard() {
	const supabase = await createClient();
	const { data: { user }, error: authError } = await supabase.auth.getUser();
	if (authError || !user) redirect("/signup?mode=login");
	const userId = user.id;

	const [profileRes, favoritesRes, historyRes, countRes, toolsRes, savedItemsRes] = await Promise.all([
		supabase.from("users").select("user_id, first_name, display_name, avatar_url, email, created_at, whatsapp_number, whatsapp_verified, wa_verify_code, weekly_opted_in, whatsapp_opted_out").eq("user_id", userId).maybeSingle(),
		supabase.from("user_favorites").select("id, item_type, item_slug, item_name, item_keyword, item_color, item_branch, saved_at").eq("user_id", userId).order("saved_at", { ascending: false }),
		supabase.from("assessment_history").select("id, completed_at, tool_slug, tool_name, score, level, friction_type").eq("user_id", userId).order("completed_at", { ascending: false }).limit(HISTORY_LIMIT),
		supabase.from("assessment_history").select("*", { count: "exact", head: true }).eq("user_id", userId),
		supabase.from("tools").select("slug, branch, color"),
		supabase.from("saved_items").select("id, url, title, category, saved_at").eq("user_id", userId).order("saved_at", { ascending: false }).limit(SAVED_ITEMS_LIMIT),
	]);

	if (profileRes.data == null) {
		logDbError("load user profile", profileRes.error as DbErrorLike);
		redirect("/signup?mode=login");
	}

	logDbError("load favorites", favoritesRes.error as DbErrorLike);
	logDbError("load assessment history", historyRes.error as DbErrorLike);
	logDbError("count total assessments", countRes.error as DbErrorLike);
	logDbError("load tools", toolsRes.error as DbErrorLike);
	logDbError("load saved items", savedItemsRes.error as DbErrorLike);

	const profile = profileRes.data;
	const favorites = favoritesRes.data ?? [];
	const history = (historyRes.data ?? []) as HistoryRow[];
	const tools = toolsRes.data ?? [];
	const savedItems = savedItemsRes.data ?? [];
	const totalAssessments = countRes.count ?? history.length;

	const dashboardMeta = {
		currentStreak: calculateStreak(history),
		weeklyActivity: calculateWeeklyActivity(history),
		totalAssessments,
	};

	return (
		<>
			<section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
				<div className="absolute inset-0">
					<img src="/Images/banners/dash%20banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
				</div>
				<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
					<p className="t-label text-white/50 mb-3 font-mono tracking-widest">YOUR DASHBOARD</p>
					<h1 className="font-display font-black uppercase text-white leading-none max-w-2xl" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}>
						{profile.first_name || "Dashboard"}
					</h1>
				</div>
			</section>
			<DashboardClient
				profile={profile}
				initialFavorites={favorites}
				initialHistory={history}
				tools={tools}
				initialSavedItems={savedItems}
				dashboardMeta={dashboardMeta}
			/>
		</>
	);
}
