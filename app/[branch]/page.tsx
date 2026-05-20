import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { branches } from "@/lib/constants";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { GetSor7edButton } from "@/components/buttons/GetSor7edButton";
import Link from "next/link";

export async function generateStaticParams() {
  return branches.map(b => ({ branch: b.slug }));
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch: slug } = await params;
  const branchData = branches.find(b => b.slug === slug);
  if (!branchData) notFound();

  const supabase = await createClient();
  
  const [{ data: tools }, { data: articles }] = await Promise.all([
    supabase
      .from("tools")
      .select("*")
      .ilike("branch", branchData.name)
      .eq("status", "Published"),
    supabase
      .from("protocols")
      .select("*")
      .ilike("branch", branchData.name)
      .eq("status", "Published")
      .limit(6),
  ]);

  return (
    <div className="pt-16">
      {/* Branch Header */}
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20">
          <div className="flex items-start gap-5 mb-8">
            <span className="text-4xl" aria-hidden="true">
              {branchData.icon || "•"}
            </span>
            <div>
              <p className="t-label text-accent mb-3">{branchData.num} of 7</p>
              <h1 className="t-display mb-4">{branchData.name}</h1>
              <p className="t-body max-w-xl text-pretty">
                {branchData.description}
              </p>
            </div>
          </div>

          {/* Branch Navigation Pills */}
          <div className="flex flex-wrap gap-2">
            {branches.map(b => (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className={`tag transition-all ${
                  b.slug === slug ? "tag-accent" : "hover:border-border-strong"
                }`}
              >
                {b.icon || "•"} {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Section */}
      {tools && tools.length > 0 && (
        <section className="border-b border-border-subtle">
          <div className="page-container">
            <div className="py-5 flex items-center justify-between border-b border-border-subtle">
              <p className="t-label">Tools for {branchData.name}</p>
              <Link href="/tools" className="t-label hover:text-ink transition-colors">
                All tools →
              </Link>
            </div>
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map(tool => (
                <div key={tool.id} className="card group">
                  <div className="p-5">
                    <h3 className="t-heading mb-2">{tool.name}</h3>
                    <p className="t-small line-clamp-2 mb-5">
                      {tool.short_description || tool.tldr}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="t-label hover:text-ink transition-colors"
                      >
                        Start assessment →
                      </Link>
                      <GetSor7edButton
                        command={`RUN ${tool.slug}`}
                        label="Run"
                        size="sm"
                        variant="outline"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      {articles && articles.length > 0 && (
        <section>
          <div className="page-container">
            <div className="py-5 flex items-center justify-between border-b border-border-subtle">
              <p className="t-label">Articles</p>
              <Link href="/intelligence" className="t-label hover:text-ink transition-colors">
                All articles →
              </Link>
            </div>
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(article => (
                <ArticleCard
                  key={article.slug}
                  {...article}
                  excerpt={article.summary}
                  variant="default"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
