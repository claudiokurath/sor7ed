import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  // PostgREST treats `,` `.` `(` `)` as filter syntax — quote the value so
  // user input can't break out of the ilike pattern into other clauses.
  const escaped = q.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const like = `"%${escaped}%"`;

  const [toolsRes, articlesRes] = await Promise.all([
    supabase
      .from("tools")
      .select("slug, name, short_description, branch, keyword, color")
      .or(`name.ilike.${like},short_description.ilike.${like},keyword.ilike.${like}`)
      .limit(8),
    supabase
      .from("protocols")
      .select("id, title, excerpt, branch, slug")
      .eq("status", "Published")
      .or(`title.ilike.${like},excerpt.ilike.${like}`)
      .limit(5),
  ]);

  const results = [
    ...(toolsRes.data ?? []).map(t => ({
      id: `tool-${t.slug}`,
      type: "tool" as const,
      title: t.name,
      description: t.short_description ?? "",
      url: `/tools/${t.slug}`,
      category: t.branch ?? "",
      keyword: t.keyword ?? undefined,
    })),
    ...(articlesRes.data ?? []).map(a => ({
      id: `article-${a.id}`,
      type: "article" as const,
      title: a.title,
      description: a.excerpt ?? "",
      url: `/intelligence/${a.slug}`,
      category: a.branch ?? "",
    })),
  ];

  return NextResponse.json({ results });
}
