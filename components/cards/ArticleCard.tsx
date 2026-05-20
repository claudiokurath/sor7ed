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
  if (variant === "compact") {
    return (
      <Link
        href={`/intelligence/${slug}`}
        className="group flex items-start gap-4 py-4 border-b border-border-subtle last:border-0 hover:opacity-80 transition-opacity"
      >
        {cover_image && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-raised">
            <Image
              src={cover_image}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="tag tag-accent">{branch}</span>
            {read_time && <span className="t-label">{read_time} min</span>}
          </div>
          <h3 className="t-heading line-clamp-2 text-pretty group-hover:text-ink-secondary transition-colors">
            {title}
          </h3>
        </div>
        <span
          className="text-ink-disabled group-hover:text-ink group-hover:translate-x-1 transition-all mt-1 shrink-0"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/intelligence/${slug}`} className="group block">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-raised mb-5 img-zoom">
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
            <div className="w-full h-full bg-surface-raised flex items-end p-6">
              <span className="font-display text-4xl text-ink-disabled uppercase">
                {branch}
              </span>
            </div>
          )}
          {keyword && (
            <div className="absolute top-4 left-4">
              <span className="tag tag-accent t-mono">{keyword}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="tag">{branch}</span>
          {read_time && <span className="t-label">{read_time} min read</span>}
        </div>

        <h2 className="t-title mb-3 text-pretty group-hover:text-ink-secondary transition-colors">
          {title}
        </h2>

        {excerpt && (
          <p className="t-body line-clamp-2 text-pretty">{excerpt}</p>
        )}
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/intelligence/${slug}`} className="group card block">
      {cover_image && (
        <div className="relative aspect-[16/9] img-zoom bg-surface-raised">
          <Image
            src={cover_image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {keyword && (
            <div className="absolute top-3 left-3">
              <span className="tag tag-accent t-mono">{keyword}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag">{branch}</span>
          {read_time && <span className="t-label">{read_time} min</span>}
        </div>
        
        <h3 className="t-heading line-clamp-2 mb-2 text-pretty group-hover:text-ink-secondary transition-colors">
          {title}
        </h3>
        
        {excerpt && (
          <p className="t-small line-clamp-2 text-pretty mb-4">{excerpt}</p>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <span className="t-label text-ink-secondary group-hover:text-ink transition-colors">
            Read article
          </span>
          <span
            className="text-ink-disabled group-hover:text-ink group-hover:translate-x-1 transition-all"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
