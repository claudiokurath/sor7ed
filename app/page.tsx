import HomeClient from "@/components/HomeClient";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, tldr, excerpt, cover_image, read_time")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(3);

  return <HomeClient featuredArticles={articles || []} />;
}
