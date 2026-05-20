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

// Standard card — used for all articles
function ArticleCard({ post, isLast }: { post: Post; isLast: boolean }) {
  const preview = post.summary || post.excerpt;
  return (
    <div className={`rounded-2xl overflow-hidden flex flex-col bg-black border border-white/5 hover:border-ps-yellow/30 transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer ${!isLast ? "" : ""}`}>
      
      {/* Header (Title & Meta) above image */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-ps-yellow/10 text-ps-yellow text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {post.branch}
          </span>
          {post.read_time && (
            <span className="text-white/30 text-[10px] font-sans uppercase tracking-wider">
              {post.read_time} min
            </span>
          )}
        </div>
        <h3 className="font-display uppercase text-base text-white leading-tight group-hover:text-ps-yellow transition-colors">
          {post.title}
        </h3>
      </div>

      {/* Cover image with zoom effect on card hover */}
      {post.cover_image && (
        <div className="h-48 overflow-hidden border-b border-white/5">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-6">
        <p className="text-white/40 text-xs leading-relaxed line-clamp-3">
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 mt-auto">
        <Link
          href={`/intelligence/${post.slug}`}
          className="text-[10px] font-sans font-bold uppercase tracking-widest text-ps-yellow hover:text-white transition-colors"
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

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10 pb-4 border-b border-gray-100">
        {branchFilters.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-black/40 font-sans text-sm">No articles match this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((post, i) => (
            <ArticleCard key={post.slug} post={post} isLast={i === visible.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
