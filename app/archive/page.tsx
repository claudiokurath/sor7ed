import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageBanner from "@/components/PageBanner";

export const metadata = { title: "Archive — SOR7ED" };

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, created_at, read_time")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  const articles = posts ?? [];

  return (
    <div className="pb-20">
      <PageBanner src="/Images/banners/blog banner.png" />
      <div className="page-container">
        <div className="section-sm border-b border-border-subtle mb-10">
          <p className="t-label text-[#00C4C4] mb-2">Everything</p>
          <h1 className="t-display">Archive</h1>
        </div>

        <div className="flex flex-col divide-y divide-border-subtle">
          {articles.map((post) => (
            <Link
              key={post.slug}
              href={`/intelligence/${post.slug}`}
              className="group flex gap-4 py-5 hover:bg-[#0d1619] -mx-4 px-4 transition-colors duration-150"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 aspect-video bg-[#0d1619] overflow-hidden">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="tag tag-accent">{post.branch}</span>
                  {post.read_time && <span className="t-label opacity-50">{post.read_time} min</span>}
                </div>
                <h2 className="t-heading text-sm line-clamp-1 group-hover:text-[#00C4C4] transition-colors">{post.title}</h2>
                {post.summary && <p className="t-small line-clamp-1 hidden sm:block">{post.summary}</p>}
              </div>

              <span className="t-label text-[#00C4C4] self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </Link>
          ))}

          {articles.length === 0 && (
            <p className="t-small py-10 text-center opacity-40">Nothing here yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
