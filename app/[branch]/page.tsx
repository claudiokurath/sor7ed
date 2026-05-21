import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const BRANCHES: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  "keep-going":   { label: "Keep Going",   emoji: "⚡", desc: "Energy, momentum and getting unstuck when your brain refuses to cooperate.", color: "#00C4C4" },
  "spend-smart":  { label: "Spend Smart",  emoji: "💷", desc: "Money clarity, budgeting without shame, and financial admin that doesn't spiral.", color: "#00A0C4" },
  "feel-good":    { label: "Feel Good",    emoji: "🌿", desc: "Rest, body regulation, nervous system tools, and getting enough sleep.", color: "#9B00C4" },
  "plan-ahead":   { label: "Plan Ahead",   emoji: "🗓", desc: "Structure, scheduling, and planning systems that actually fit your brain.", color: "#00C4C4" },
  "be-connected": { label: "Be Connected", emoji: "🤝", desc: "Relationships, communication scripts, and handling hard conversations.", color: "#3C8CE8" },
  "be-yourself":  { label: "Be Yourself",  emoji: "🪞", desc: "Identity, self-knowledge, masking, and understanding how you're wired.", color: "#C400C4" },
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
  
  const [
    { data: dbBranch },
    { data: posts },
    { data: tools }
  ] = await Promise.all([
    supabase
      .from("branches")
      .select("cover_image")
      .ilike("slug", branch)
      .single(),
    supabase
      .from("protocols")
      .select("slug, title, branch, summary, cover_image, read_time")
      .neq("status", "Draft")
      .ilike("branch", b.label)
      .order("created_at", { ascending: false }),
    supabase
      .from("tools")
      .select("slug, name, branch, short_description, cover_image")
      .neq("status", "Draft")
      .ilike("branch", b.label)
      .order("created_at", { ascending: false })
  ]);

  const articles = posts ?? [];
  const toolList = tools ?? [];

  return (
    <main className="min-h-screen bg-black pt-14">
      {/* Branch hero */}
      <section className="relative h-[45vh] w-full overflow-hidden border-b border-white/10 bg-[#080f11] flex items-end">
        {dbBranch?.cover_image ? (
          <img
            src={dbBranch.cover_image}
            alt={b.label}
            className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-40 brightness-75"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#080f11]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Editorial Text Overlay */}
        <div className="relative z-10 w-full page-container pb-10 flex flex-col justify-end">
          <Link href="/explore" className="t-label text-[#00C4C4] hover:underline mb-4 block">← All branches</Link>
          <div className="flex items-start gap-4">
            <span className="text-4xl mt-1">{b.emoji}</span>
            <div>
              <h1 className="t-display mb-3 text-white uppercase font-black tracking-tight" style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}>{b.label}</h1>
              <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed">{b.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      {toolList.length > 0 && (
        <section className="section border-b border-border-subtle">
          <div className="page-container">
            <h2 className="t-title mb-8">Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolList.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group relative aspect-[3/4] border border-white/10 hover:border-[#E8453C]/50 overflow-hidden transition-all duration-300 flex flex-col justify-end"
                >
                  {tool.cover_image ? (
                    <img
                      src={tool.cover_image}
                      alt={tool.name}
                      className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0d1619]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95" />

                  {/* Bottom solid text box container */}
                  <div className="relative z-10 w-full bg-[#0d1619]/95 border-t border-white/10 p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="tag bg-black/40 border-[#E8453C]/20 text-[#E8453C] text-[9px] px-1.5 py-0.5">{tool.branch}</span>
                      <span className="text-[10px] text-white/40 font-mono">Interactive</span>
                    </div>
                    
                    <h3 className="t-heading text-sm font-bold text-white group-hover:text-[#E8453C] transition-colors leading-snug line-clamp-2 uppercase">
                      {tool.name}
                    </h3>
                    
                    {tool.short_description && (
                      <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">
                        {tool.short_description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1 text-[9px] font-mono tracking-widest text-[#E8453C]">
                      <span>LAUNCH TOOL</span>
                      <span>→</span>
                    </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((post) => (
                <Link
                  key={post.slug}
                  href={`/intelligence/${post.slug}`}
                  className="group relative aspect-[3/4] border border-white/10 hover:border-[#00C4C4]/50 overflow-hidden transition-all duration-300 flex flex-col justify-end"
                >
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0d1619]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95" />

                  {/* Bottom solid text box container */}
                  <div className="relative z-10 w-full bg-[#0d1619]/95 border-t border-white/10 p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="tag tag-accent bg-black/40 border-[#00C4C4]/20 text-[9px] px-1.5 py-0.5">{post.branch}</span>
                      <span className="text-[10px] text-white/40 font-mono">{post.read_time ? `${post.read_time} min` : ""}</span>
                    </div>
                    
                    <h3 className="t-heading text-sm font-bold text-white group-hover:text-[#00C4C4] transition-colors leading-snug line-clamp-2 uppercase">
                      {post.title}
                    </h3>
                    
                    {post.summary && (
                      <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">
                        {post.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1 text-[9px] font-mono tracking-widest text-[#00C4C4]">
                      <span>READ PROTOCOL</span>
                      <span>→</span>
                    </div>
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
