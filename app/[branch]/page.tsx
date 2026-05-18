import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { branches } from "@/lib/constants";
import SaveToPhoneButton from "@/components/SaveToPhoneButton";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
  if (!branchInfo) return { title: "Branch Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";
  const description = `${branchInfo.description} — protocols delivered to your WhatsApp.`;

  return {
    title: `${branchInfo.name} | SOR7ED`,
    description,
    openGraph: {
      title: `${branchInfo.name} | SOR7ED`,
      description,
      url: `${siteUrl}/${resolvedParams.branch}`,
      siteName: "SOR7ED",
      type: "website",
    },
  };
}

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = await params;
  const branchInfo = branches.find(b => b.slug === resolvedParams.branch);
  if (!branchInfo) notFound();

  const supabase = await createClient();

  const [{ data: articles }, { data: tools }] = await Promise.all([
    supabase
      .from("protocols")
      .select("slug, title, excerpt, summary, cover_image, read_time")
      .eq("branch", branchInfo!.name)
      .eq("status", "Published")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("tools")
      .select("slug, name, tldr, short_description, cover_image, color")
      .eq("branch", branchInfo!.name)
      .neq("status", "Draft")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const hasContent = (articles?.length || 0) + (tools?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-white">

      {/* Header — black */}
      <section className="bg-black border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10">
          <Link
            href="/explore"
            className="text-white/30 hover:text-ps-yellow text-[10px] font-display uppercase tracking-widest transition-colors block mb-8"
          >
            ← All branches
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl">{branchInfo!.icon}</span>
            <div>
              <p className="label mb-2" style={{ color: branchInfo!.color }}>{branchInfo!.num}</p>
              <h1
                className="font-display uppercase text-white leading-none"
                style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", letterSpacing: "-0.01em" }}
              >
                {branchInfo!.name.toUpperCase()}
              </h1>
            </div>
          </div>

          <p className="text-white/50 text-base max-w-lg leading-relaxed mt-4">
            {branchInfo!.description}
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-8">
            <div>
              <span className="font-display text-3xl text-white">{articles?.length || 0}</span>
              <span className="text-white/30 text-[10px] font-display uppercase tracking-widest ml-2">Articles</span>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <span className="font-display text-3xl text-white">{tools?.length || 0}</span>
              <span className="text-white/30 text-[10px] font-display uppercase tracking-widest ml-2">Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools — yellow */}
      {tools && tools.length > 0 && (
        <section className="bg-ps-yellow border-b-2 border-black">
          <div className="max-w-6xl mx-auto">
            <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-black/15 flex items-center justify-between">
              <p className="label">Assessments</p>
              <Link href="/tools" className="label hover:text-black transition-colors">All tools →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => {
                const preview = tool.short_description || tool.tldr;
                const isLast = i === tools.length - 1;
                return (
                  <div
                    key={tool.slug}
                    className={`flex flex-col border-black/15
                      ${i % 3 !== 2 ? "lg:border-r" : ""}
                      ${i % 2 !== 1 ? "sm:border-r sm:lg:border-r-0" : ""}
                      ${!isLast ? "border-b" : ""}
                    `}
                  >
                    {/* Cover image */}
                    {tool.cover_image && (
                      <div className="h-40 overflow-hidden border-b border-black/15">
                        <img src={tool.cover_image} alt={tool.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-display uppercase text-base text-black leading-tight mb-2">{tool.name}</h3>
                      <p className="text-black/50 text-sm leading-relaxed flex-1 line-clamp-3">{preview}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/15 px-5 py-3">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow hover:bg-black px-2 py-1 -ml-2 transition-colors"
                      >
                        Start assessment →
                      </Link>
                      <SaveToPhoneButton
                        title={tool.name}
                        summary={preview || undefined}
                        pageUrl={`/tools/${tool.slug}`}
                        size="sm"
                        label="Save"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Articles — white */}
      {articles && articles.length > 0 && (
        <section className="bg-white border-b-2 border-black">
          <div className="max-w-6xl mx-auto">
            <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-black/10 flex items-center justify-between">
              <p className="label">Field Reads</p>
              <Link href="/intelligence" className="label hover:text-black transition-colors">All articles →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => {
                const preview = article.summary || article.excerpt;
                const isLast = i === articles.length - 1;
                return (
                  <div
                    key={article.slug}
                    className={`flex flex-col border-black/10
                      ${i % 3 !== 2 ? "lg:border-r" : ""}
                      ${i % 2 !== 1 ? "sm:border-r sm:lg:border-r-0" : ""}
                      ${!isLast ? "border-b" : ""}
                    `}
                  >
                    {/* Cover image */}
                    {article.cover_image && (
                      <div className="h-40 overflow-hidden border-b border-black/10">
                        <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="label-yellow">{branchInfo!.name}</span>
                        {article.read_time && (
                          <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">
                            {article.read_time} min read
                          </span>
                        )}
                      </div>
                      <h3 className="font-display uppercase text-base text-black leading-tight mb-2">{article.title}</h3>
                      <p className="text-black/50 text-sm leading-relaxed flex-1 line-clamp-3">{preview}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/10 px-5 py-3">
                      <Link
                        href={`/intelligence/${article.slug}`}
                        className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow hover:bg-black px-2 py-1 -ml-2 transition-colors"
                      >
                        Read article →
                      </Link>
                      <SaveToPhoneButton
                        title={article.title}
                        summary={preview || undefined}
                        pageUrl={`/intelligence/${article.slug}`}
                        size="sm"
                        label="Save"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasContent && (
        <section className="bg-white border-b-2 border-black">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-24 text-center">
            <span className="text-6xl block mb-6">{branchInfo!.icon}</span>
            <h2 className="font-display uppercase text-2xl text-black mb-3">Coming Soon</h2>
            <p className="text-black/40 text-sm max-w-sm mx-auto leading-relaxed">
              Protocols for this branch are in development. Sign up to get notified when they drop.
            </p>
            <Link href="/signup" className="btn-yellow mt-8 inline-flex">
              Get notified →
            </Link>
          </div>
        </section>
      )}

      {/* CTA — black */}
      <section className="bg-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2
              className="font-display uppercase text-white leading-none mb-2"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              Get it sorted.
            </h2>
            <p className="text-white/30 text-xs font-display uppercase tracking-[0.2em]">
              Free · WhatsApp · No app needed
            </p>
          </div>
          <Link href="/signup" className="btn-yellow shrink-0">
            Join free →
          </Link>
        </div>
      </section>

    </div>
  );
}
