import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/cards/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — SOR7ED",
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
    <div className="pt-16">
      {/* Page Header */}
      <div className="border-b border-border-subtle">
        <div className="page-container py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="t-label text-accent mb-4">Articles</p>
            <h1 className="t-display mb-5 text-balance">
              The content your brain has been waiting for
            </h1>
            <p className="t-body text-pretty max-w-lg">
              Honest, ND-first writing. Every post ends with a WhatsApp keyword
              — text it and get a practical tool.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Layout */}
      {articles.length > 0 && (
        <div className="page-container section-sm">
          {/* Featured + Secondary */}
          {featured && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12 pb-12 border-b border-border-subtle">
              <div className="lg:col-span-3">
                <ArticleCard {...featured} excerpt={featured.summary} variant="featured" />
              </div>
              <div className="lg:col-span-2 flex flex-col justify-between gap-6">
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

          {/* Remaining Articles */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Latest - Compact List */}
              <div className="lg:col-span-1">
                <p className="t-label mb-6">Latest</p>
                <div>
                  {rest.slice(0, 6).map(article => (
                    <ArticleCard
                      key={article.slug}
                      {...article}
                      excerpt={article.summary}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>

              {/* All Articles - Card Grid */}
              <div className="lg:col-span-2">
                <p className="t-label mb-6">All articles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {rest.slice(6).map(article => (
                    <ArticleCard
                      key={article.slug}
                      {...article}
                      excerpt={article.summary}
                      variant="default"
                    />
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
