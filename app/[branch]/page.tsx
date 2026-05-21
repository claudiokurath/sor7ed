import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const BRANCHES: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  "keep-going":   { label: "Keep Going",   emoji: "⚡", desc: "Energy, momentum and getting unstuck when your brain refuses to cooperate.", color: "#00C48A" },
  "spend-smart":  { label: "Spend Smart",  emoji: "💷", desc: "Money clarity, budgeting without shame, and financial admin that doesn\'t spiral.", color: "#00A0C4" },
  "feel-good":    { label: "Feel Good",    emoji: "🌿", desc: "Rest, body regulation, nervous system tools, and getting enough sleep.", color: "#9B00C4" },
  "plan-ahead":   { label: "Plan Ahead",   emoji: "🗓", desc: "Structure, scheduling, and planning systems that actually fit your brain.", color: "#00C4C4" },
  "be-connected": { label: "Be Connected", emoji: "🤝", desc: "Relationships, communication scripts, and handling hard conversations.", color: "#3C8CE8" },
  "be-yourself":  { label: "Be Yourself",  emoji: "🪞", desc: "Identity, self-knowledge, masking, and understanding how you\'re wired.", color: "#C400C4" },
  "level-up":     { label: "Level Up",     emoji: "🚀", desc: "Skills, career, learning strategies, and work that plays to your strengths.", color: "#C4A000" },
};

type Props = { params: Promise<{ branch: string }> };

export async function generateMetadata({ params }: Props) {
  const { branch } = await params;
  const b = BRANCHES[branch];
  if (!b) return {};
  return { title: `${b.label} — SOR7ED` };
}

export default async function BranchPage({ params }: Props) {
  const { branch } = await params;
  const b = BRANCHES[branch];
  if (!b) notFound();

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time")
    .eq("status", "Published")
    .ilike("branch", b.label)
    .order("created_at", { ascending: false });

  const { data: tools } = await supabase
    .from("tools")
    .select("slug, title, branch, description, cover_image")
    .eq("status", "Published")
    .ilike("branch", b.label)
    .order("created_at", { ascending: false });

  const articles = posts ?? [];
  const toolList = tools ?? [];

  return (
    <main className="pt-20">
      {/* Branch hero */}
      <section className="section-sm border-b border-border-subtle" data-branch={branch}>
        <div className="page-container">
          <Link href="/explore" className="t-label text-[#00C4C4] hover:underline mb-6 block">← All branches</Link>
          <div className="flex items-start gap-4">
            <span className="text-4xl mt-1">{b.emoji}</span>
            <div>
              <h1 className="t-display mb-3" style={{ color: b.color }}>{b.label}</h1>
              <p className="t-body max-w-xl">{b.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      {toolList.length > 0 && (
        <section className="section border-b border-border-subtle">
          <div className="page-container">
            <h2 className="t-title mb-8">Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {toolList.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}
                  className="group bg-[#080f11] flex flex-col overflow-hidden hover:bg-[#0d1619] transition-colors duration-200">
                  <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619]">
                    {tool.cover_image ? (
                      <img src={tool.cover_image} alt={tool.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : <div className="w-full h-full" />}
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="t-heading text-sm line-clamp-2 group-hover:text-[#00C4C4] transition-colors">{tool.title}</h3>
                    {tool.description && <p className="t-small line-clamp-2">{tool.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts */}
      {articles.length > 0 && (
        <section className="section">
          <div className="page-container">
            <h2 className="t-title mb-8">Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {articles.map((post) => (
                <Link key={post.slug} href={`/intelligence/${post.slug}`}
                  className="group bg-[#080f11] flex flex-col overflow-hidden hover:bg-[#0d1619] transition-colors duration-200">
                  <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619]">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : <div className="w-full h-full" />}
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="t-heading text-sm line-clamp-2 group-hover:text-[#00C4C4] transition-colors">{post.title}</h3>
                    {post.summary && <p className="t-small line-clamp-2">{post.summary}</p>}
                    {post.read_time && <span className="t-label opacity-50">{post.read_time} min read</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {articles.length === 0 && toolList.length === 0 && (
        <div className="section page-container text-center">
          <p className="t-small opacity-40">Content coming soon.</p>
        </div>
      )}
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(BRANCHES).map((branch) => ({ branch }));
}
