"use client";

import { useState } from "react";
import VisualCard from "@/components/ui/VisualCard";
import FilterPill from "@/components/ui/FilterPill";

type Tool = {
  id: string;
  slug: string;
  name: string;
  branch: string;
  color: string;
  keyword: string;
  tldr: string;
  description: string;
  short_description: string;
  cover_image?: string | null;
  featured: boolean;
};

export default function ToolList({ initialTools }: { initialTools: Tool[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const branches = ['ALL', ...Array.from(new Set(initialTools.map(t => t.branch).filter(Boolean)))];
  const featured  = initialTools.filter(t => t.featured);
  const rest = activeFilter === 'ALL'
    ? initialTools.filter(t => !t.featured)
    : initialTools.filter(t => t.branch === activeFilter && !t.featured);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-10 border-b-2 border-ps-white/20 pb-6">
        {branches.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {/* Featured carousel */}
      {featured.length > 0 && activeFilter === 'ALL' && (
        <section className="mb-12">
          <h2 className="display-sm text-ps-white mb-4">Featured</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 sm:-mx-8 md:-mx-0 px-5 sm:px-8 md:px-0 pb-4">
            {featured.map((tool, i) => (
              <div key={tool.slug} className="snap-start shrink-0 w-[82vw] sm:w-[420px]">
                <VisualCard
                  title={tool.name}
                  category={tool.branch}
                  subtitle={tool.short_description || tool.tldr}
                  imageUrl={tool.cover_image}
                  href={`/tools/${tool.slug}`}
                  aspectRatio="blog"
                  priority={i === 0}
                />
              </div>
            ))}
            <div className="shrink-0 w-2" />
          </div>
        </section>
      )}

      {/* Grid */}
      {rest.length === 0 ? (
        <div className="text-center py-16 border-2 border-ps-white">
          <p className="text-ps-white/40 font-display uppercase tracking-widest">No tools in this category</p>
        </div>
      ) : (
        <section>
          <h2 className="display-sm text-ps-white mb-4">
            {activeFilter === 'ALL' ? 'All Tools' : activeFilter}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
            {rest.map((tool, i) => (
              <VisualCard
                key={tool.slug}
                title={tool.name}
                category={tool.branch}
                subtitle={tool.short_description || tool.tldr}
                imageUrl={tool.cover_image}
                href={`/tools/${tool.slug}`}
                aspectRatio="tool"
                priority={i < 4}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
