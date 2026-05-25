import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageBanner from "@/components/PageBanner";

export const metadata = { title: "Archive — SOR7ED" };

const BRANCH_SLUG_MAP: Record<string, string> = {
  "Keep Going": "keep-going",
  "Spend Smart": "spend-smart",
  "Feel Good": "feel-good",
  "Plan Ahead": "plan-ahead",
  "Be Connected": "be-connected",
  "Be Yourself": "be-yourself",
  "Level Up": "level-up",
};

export default async function ArchivePage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: branchesData }] = await Promise.all([
    supabase
      .from("protocols")
      .select("slug, title, branch, summary, cover_image, created_at, read_time")
      .eq("status", "Published")
      .order("created_at", { ascending: false }),
    supabase
      .from("branches")
      .select("slug, name, num")
      .order("num", { ascending: true }),
  ]);

  const articles = posts ?? [];
  const branchOrder = (branchesData ?? []).map(b => b.name);

  const byBranch: Record<string, typeof articles> = {};
  for (const article of articles) {
    const key = article.branch || "Other";
    if (!byBranch[key]) byBranch[key] = [];
    byBranch[key].push(article);
  }

  const orderedBranches = [
    ...branchOrder.filter(name => byBranch[name]),
    ...Object.keys(byBranch).filter(name => !branchOrder.includes(name)),
  ];

  return (
    <div className="pb-20">
      <PageBanner src="/Images/banners/blog banner.png" />
      <div className="page-container">
        <div className="section-sm border-b border-border-subtle mb-12">
          <p className="t-label text-[#00C4C4] mb-2">Everything</p>
          <h1 className="t-display">Archive</h1>
        </div>

        <div className="flex flex-col gap-16">
          {orderedBranches.map(branchName => {
            const slug = BRANCH_SLUG_MAP[branchName] ?? branchName.toLowerCase().replace(/\s+/g, '-');
            const branchArticles = byBranch[branchName] ?? [];
            return (
              <section key={branchName}>
                {/* Branch section header image */}
                <div className="relative w-full h-32 md:h-40 overflow-hidden mb-6">
                  <img
                    src={`/Images/members/${slug}.png`}
                    alt={branchName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent flex items-center">
                    <div className="px-6">
                      <p className="t-label text-[#00C4C4] mb-1">
                        {branchArticles.length} {branchArticles.length === 1 ? 'article' : 'articles'}
                      </p>
                      <h2 className="font-display font-black uppercase text-white text-xl md:text-2xl leading-none">
                        {branchName}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Articles list */}
                <div className="flex flex-col divide-y divide-border-subtle">
                  {branchArticles.map(post => (
                    <Link
                      key={post.slug}
                      href={`/intelligence/${post.slug}`}
                      className="group flex gap-4 py-5 hover:bg-[#0d1619] -mx-4 px-4 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 w-20 aspect-video bg-[#0d1619] overflow-hidden">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.read_time && <span className="t-label opacity-50">{post.read_time} min</span>}
                        </div>
                        <h3 className="t-heading text-sm line-clamp-1 group-hover:text-[#00C4C4] transition-colors">{post.title}</h3>
                        {post.summary && <p className="t-small line-clamp-1 hidden sm:block">{post.summary}</p>}
                      </div>
                      <span className="t-label text-[#00C4C4] self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {articles.length === 0 && (
            <p className="t-small py-10 text-center opacity-40">Nothing here yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
