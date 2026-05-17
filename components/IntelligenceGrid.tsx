"use client";

import { useState } from "react";
import VisualCard from "@/components/ui/VisualCard";
import FilterPill from "@/components/ui/FilterPill";
import { branches } from "@/lib/constants";

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

export default function IntelligenceGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const presentBranches = ['ALL', ...Array.from(new Set(posts.map(p => p.branch).filter(Boolean)))];
  const featured = posts.find(p => p.featured);
  const filtered = activeFilter === 'ALL'
    ? posts.filter(p => !p.featured)
    : posts.filter(p => p.branch === activeFilter);

  const getBranchColor = (branchName: string) => branches.find(b => b.name === branchName)?.color ?? '#EBA904';

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide mb-8">
        {presentBranches.map(b => (
          <FilterPill
            key={b}
            label={b}
            isActive={activeFilter === b}
            onClick={() => setActiveFilter(b)}
          />
        ))}
      </div>

      {/* Featured */}
      {featured && activeFilter === 'ALL' && (
        <section className="mb-10">
          <h2 className="font-display text-lg uppercase tracking-wide text-text-primary mb-4">Featured</h2>
          <VisualCard
            title={featured.title}
            category={featured.branch || 'FEATURED'}
            subtitle={featured.summary || featured.tldr || featured.excerpt}
            imageUrl={featured.cover_image}
            fallbackColor={getBranchColor(featured.branch)}
            href={`/intelligence/${featured.slug}`}
            aspectRatio="featured"
            priority
          />
        </section>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-surface-border rounded-2xl">
          <p className="text-text-muted text-sm font-bold uppercase tracking-widest">No briefings match.</p>
        </div>
      ) : (
        <section>
          <h2 className="font-display text-lg uppercase tracking-wide text-text-primary mb-4">
            {activeFilter === 'ALL' ? 'All Briefings' : activeFilter}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, i) => (
              <VisualCard
                key={post.slug}
                title={post.title}
                category={post.branch || 'Intelligence'}
                subtitle={post.read_time ? `${post.read_time} · ${post.summary || post.tldr}` : (post.summary || post.tldr)}
                imageUrl={post.cover_image}
                fallbackColor={getBranchColor(post.branch)}
                href={`/intelligence/${post.slug}`}
                aspectRatio="blog"
                priority={i < 3}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
