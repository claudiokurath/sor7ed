import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/cards/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence — SOR7ED",
  description: "Honest, ND-first writing. No fluff. Always a next step.",
};

export default async function IntelligencePage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword, created_at")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) console.error("[IntelligencePage]", error.message);

  const articles = posts ?? [];
  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return (
    <div className="pt-14 bg-[#080f11] min-h-screen">

      {/* ── Page Header: brutalist rule ── */}
      <div className="page-container">
        <div className="py-16 md:py-20 border-b border-white/8">
          <p className="t-label text-accent mb-4">Intelligence / Articles</p>
          <h1 className="t-display text-[#f0ede8] text-balance max-w-2xl mb-5">
            The content your brain has been waiting for
          </h1>
          <p className="t-body max-w-lg">
            Honest, ND-first writing. Every post ends with a WhatsApp keyword — text it and get a practical tool.
          </p>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="page-container">

          {/* ── Featured Hero Spread ── */}
          {featured && (
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/8 py-12 md:py-16 gap-px bg-white/8">
              {/* Big feature */}
              <div className="lg:col-span-7 bg-[#080f11] pr-0 lg:pr-10">
                <ArticleCard {...featured} excerpt={featured.summary} variant="featured" />
              </div>

              {/* Secondary pair */}
              <div className="lg:col-span-5 bg-[#080f11] pl-0 lg:pl-10 border-t lg:border-t-0 lg:border-l border-white/8 pt-10 lg:pt-0 flex flex-col justify-between gap-10">
                {secondary.map(article => (
                  <ArticleCard
                    key={article.slug}
                    {...article}
                    excerpt={article.summary}
                    variant="featured"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Rest of articles ── */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 py-12 md:py-16 gap-px bg-white/8">

              {/* Compact list sidebar */}
              <div className="lg:col-span-4 bg-[#080f11] pr-0 lg:pr-10">
                <p className="t-label mb-6 text-[rgba(240,237,232,0.38)]">Latest</p>
                {rest.slice(0, 6).map(article => (
                  <ArticleCard
                    key={article.slug}
                    {...article}
                    excerpt={article.summary}
                    variant="compact"
                  />
                ))}
              </div>

              {/* Card grid */}
              <div className="lg:col-span-8 bg-[#080f11] pl-0 lg:pl-10 border-t lg:border-t-0 lg:border-l border-white/8 pt-10 lg:pt-0">
                <p className="t-label mb-6 text-[rgba(240,237,232,0.38)]">All articles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/8">
                  {rest.slice(6).map(article => (
                    <div key={article.slug} className="bg-[#080f11]">
                      <ArticleCard
                        {...article}
                        excerpt={article.summary}
                        variant="default"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {articles.length === 0 && (
        <div className="page-container section text-center">
          <p className="t-body">No articles published yet.</p>
        </div>
      )}
    </div>
  );
}
