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

function ArticleCard({ post }: { post: Post }) {
  const preview = post.summary || post.tldr || post.excerpt;

  return (
    <div className="border-2 border-black flex flex-col bg-white">
      {/* Colour band */}
      <div className="h-1 bg-black" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-yellow">{post.branch || "Article"}</span>
          {post.read_time && (
            <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">
              {post.read_time} min read
            </span>
          )}
        </div>
        <h3 className="font-display uppercase text-base text-black leading-tight mb-2">
          {post.title}
        </h3>
        <p className="text-black/50 text-sm leading-relaxed flex-1 line-clamp-3">
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

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-4 border-b-2 border-black/10">
        {branchFilters.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 border-2 border-black">
          <p className="text-black/40 font-display uppercase tracking-widest">No articles match</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(post => <ArticleCard key={post.slug} post={post} />)}
        </div>
      )}
    </div>
  );
}
