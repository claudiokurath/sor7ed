"use client";

import { useState } from "react";
import Link from "next/link";
import FilterPill from "@/components/ui/FilterPill";
import SaveToPhoneButton from "@/components/SaveToPhoneButton";

type Post = {
  id: string;
  slug: string;
  title: string;
  branch: string;
  keyword: string;
  tldr: string;
  excerpt: string;
  summary: string;
  description: string;
  cover_image: string;
  read_time: string;
  level: string;
  featured?: boolean;
};

// Large hero card — used for the first article
function HeroCard({ post }: { post: Post }) {
  const preview = post.summary || post.excerpt;
  return (
    <div className="border-b-2 border-black grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Image */}
      {post.cover_image ? (
        <div className="h-64 lg:h-auto img-zoom border-b-2 lg:border-b-0 lg:border-r-2 border-black">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "100%" }}
          />
        </div>
      ) : (
        <div className="hidden lg:flex h-64 lg:h-auto bg-black border-r-2 border-black items-end p-10">
          <span className="font-display uppercase text-white/8 leading-none"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}>
            {post.branch}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col p-7 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="label-yellow">{post.branch}</span>
          {post.read_time && (
            <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">{post.read_time} min read</span>
          )}
        </div>

        <h2
          className="font-display uppercase text-black leading-tight mb-5 flex-1"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", letterSpacing: "-0.01em" }}
        >
          {post.title}
        </h2>

        <p className="text-black/55 text-sm leading-relaxed line-clamp-4 mb-8">
          {preview}
        </p>

        <div className="flex items-center justify-between border-t-2 border-black pt-5 mt-auto">
          <Link
            href={`/intelligence/${post.slug}`}
            className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
          >
            Read article →
          </Link>
          <SaveToPhoneButton
            title={post.title}
            keyword={post.keyword}
            summary={preview || undefined}
            pageUrl={`/intelligence/${post.slug}`}
            size="sm"
            label="Save"
          />
        </div>
      </div>
    </div>
  );
}

// Standard card — used for all remaining articles
function ArticleCard({ post, isLast }: { post: Post; isLast: boolean }) {
  const preview = post.summary || post.excerpt;
  return (
    <div className={`border-2 border-black flex flex-col bg-white ${!isLast ? "" : ""}`}>
      {/* Cover image */}
      {post.cover_image && (
        <div className="h-44 img-zoom border-b-2 border-black">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* No image fallback band */}
      {!post.cover_image && <div className="h-1 bg-black" />}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-yellow">{post.branch}</span>
          {post.read_time && (
            <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">
              {post.read_time} min
            </span>
          )}
        </div>
        <h3 className="font-display uppercase text-base text-black leading-tight mb-2 flex-1">
          {post.title}
        </h3>
        <p className="text-black/50 text-sm leading-relaxed line-clamp-3 mt-1">
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t-2 border-black px-5 py-3">
        <Link
          href={`/intelligence/${post.slug}`}
          className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
        >
          Read article →
        </Link>
        <SaveToPhoneButton
          title={post.title}
          keyword={post.keyword}
          summary={preview || undefined}
          pageUrl={`/intelligence/${post.slug}`}
          size="sm"
          label="Save"
        />
      </div>
    </div>
  );
}

export default function IntelligenceGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const branchFilters = ["ALL", ...Array.from(new Set(posts.map(p => p.branch).filter(Boolean)))];

  const visible = activeFilter === "ALL"
    ? posts
    : posts.filter(p => p.branch === activeFilter);

  const hero = visible[0];
  const rest = visible.slice(1);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-4 border-b-2 border-black/10">
        {branchFilters.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 border-2 border-black">
          <p className="text-black/40 font-display uppercase tracking-widest">No articles match</p>
        </div>
      ) : (
        <>
          {/* Hero — first article, large editorial treatment */}
          {hero && <HeroCard post={hero} />}

          {/* Grid — remaining articles */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {rest.map((post, i) => (
                <ArticleCard key={post.slug} post={post} isLast={i === rest.length - 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
