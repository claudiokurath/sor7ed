import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  slug: string;
  title: string;
  branch: string;
  excerpt?: string;
  cover_image?: string;
  read_time?: string;
  keyword?: string;
  variant?: "default" | "featured" | "compact";
};

const FALLBACK_COLORS: Record<string, string> = {
  "Feel Good":    "#2dd4bf",
  "Keep Going":   "#3b82f6",
  "Spend Smart":  "#22c55e",
  "Be Connected": "#f59e0b",
  "Plan Ahead":   "#06b6d4",
  "Be Yourself":  "#fb7185",
  "Level Up":     "#6366f1",
};

function BranchFallback({ branch }: { branch: string }) {
  const color = FALLBACK_COLORS[branch] ?? "#2dd4bf";
  return (
    <div
      className="w-full h-full flex items-end p-5"
      style={{
        background: `linear-gradient(135deg, #080f11 0%, ${color}18 100%)`,
        borderBottom: `2px solid ${color}40`,
      }}
    >
      <span
        className="font-display font-black text-4xl uppercase leading-none"
        style={{ color: `${color}60` }}
      >
        {branch}
      </span>
    </div>
  );
}

export function ArticleCard({
  slug,
  title,
  branch,
  excerpt,
  cover_image,
  read_time,
  keyword,
  variant = "default",
}: ArticleCardProps) {

  /* ── COMPACT: horizontal rule list item ── */
  if (variant === "compact") {
    return (
      <Link
        href={`/intelligence/${slug}`}
        className="group flex items-start gap-4 py-5 border-b border-white/8 last:border-0 hover:border-white/20 transition-all"
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-[#0d1619]">
          {cover_image ? (
            <Image src={cover_image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="56px" />
          ) : (
            <BranchFallback branch={branch} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="t-label text-accent">{branch}</span>
            {read_time && <span className="t-label">{read_time} min</span>}
          </div>
          <h3 className="text-sm font-bold uppercase tracking-tight leading-snug line-clamp-2 text-[#f0ede8] group-hover:text-accent transition-colors">
            {title}
          </h3>
        </div>

        <span className="text-[rgba(240,237,232,0.2)] group-hover:text-accent group-hover:translate-x-1 transition-all mt-0.5 shrink-0 text-sm">
          →
        </span>
      </Link>
    );
  }

  /* ── FEATURED: large hero image card ── */
  if (variant === "featured") {
    return (
      <Link href={`/intelligence/${slug}`} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#0d1619] mb-4 img-zoom">
          {cover_image ? (
            <Image
              src={cover_image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          ) : (
            <BranchFallback branch={branch} />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {keyword && (
            <div className="absolute top-4 left-4">
              <span className="tag tag-accent t-mono">{keyword}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-2 border-l-2 border-accent pl-3">
          <span className="t-label text-accent">{branch}</span>
          {read_time && <span className="t-label">{read_time} min read</span>}
        </div>

        <h2 className="font-display font-black text-xl uppercase leading-tight tracking-tight mb-3 text-[#f0ede8] group-hover:text-accent transition-colors text-balance">
          {title}
        </h2>

        {excerpt && (
          <p className="t-body line-clamp-2 text-pretty">{excerpt}</p>
        )}
      </Link>
    );
  }

  /* ── DEFAULT: grid card ── */
  return (
    <Link href={`/intelligence/${slug}`} className="group block card">
      <div className="relative aspect-[16/9] img-zoom bg-[#0d1619]">
        {cover_image ? (
          <Image
            src={cover_image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <BranchFallback branch={branch} />
        )}

        {keyword && (
          <div className="absolute top-3 left-3">
            <span className="tag tag-accent t-mono">{keyword}</span>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/8">
        <div className="flex items-center gap-2 mb-3">
          <span className="t-label text-accent">{branch}</span>
          {read_time && <span className="t-label">{read_time} min</span>}
        </div>

        <h3 className="font-bold uppercase tracking-tight text-sm leading-snug line-clamp-2 mb-3 text-[#f0ede8] group-hover:text-accent transition-colors">
          {title}
        </h3>

        {excerpt && (
          <p className="t-small line-clamp-2 text-pretty mb-4">{excerpt}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <span className="t-label text-[rgba(240,237,232,0.38)] group-hover:text-accent transition-colors">
            Read article
          </span>
          <span className="text-[rgba(240,237,232,0.2)] group-hover:text-accent group-hover:translate-x-1 transition-all text-sm">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
