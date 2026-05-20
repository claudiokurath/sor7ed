import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — SOR7ED",
  description: "Honest, ND-first writing. No fluff. Always a next step.",
};

export default async function IntelligencePage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) console.error("[IntelligencePage]", error.message);

  const articles = posts ?? [];

  return (
    <div className="min-h-screen bg-black pt-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16">

        {/* Title */}
        <h1
          className="font-display font-black uppercase text-white leading-none mb-6"
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)", letterSpacing: "-0.03em" }}
        >
          Articles
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-base max-w-xl leading-relaxed mb-14">
          Honest, ND-first writing. Every post ends with a WhatsApp keyword — text it and get a practical tool.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/intelligence/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-3">
                {article.cover_image ? (
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>
              <p className="text-white text-sm font-medium leading-tight group-hover:text-[#2dd4bf] transition-colors">
                {article.title}
              </p>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-white/40 text-sm">No articles published yet.</p>
        )}
      </div>
    </div>
  );
}
