"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

function CarouselCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group border-2 border-black hover:bg-ps-yellow transition-colors bg-white"
      style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 'clamp(220px, 55vw, 300px)' }}
    >
      <div className="relative overflow-hidden bg-black/5" style={{ aspectRatio: '3/4' }}>
        {tool.cover_image ? (
          <Image
            src={tool.cover_image}
            alt={tool.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl text-black/10 uppercase">{(tool.branch || 'T')[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4 border-t-2 border-black">
        <span className="label-yellow mb-2 block">{tool.branch}</span>
        <h3 className="font-display uppercase text-sm text-black leading-tight line-clamp-2">{tool.name}</h3>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-display uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">
          Start →
        </div>
      </div>
    </Link>
  );
}

function MosaicCard({ tool, tall }: { tool: Tool; tall?: boolean }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block border-2 border-black hover:bg-ps-yellow transition-colors bg-white"
      style={{ breakInside: 'avoid', marginBottom: '2px' }}
    >
      {tool.cover_image && (
        <div className="relative overflow-hidden bg-black/5 border-b-2 border-black" style={{ aspectRatio: tall ? '3/4' : '16/9' }}>
          <Image
            src={tool.cover_image}
            alt={tool.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <span className="label-yellow mb-2 block">{tool.branch}</span>
        <h3 className="font-display uppercase text-xs text-black leading-tight mb-2">{tool.name}</h3>
        <p className="text-black/45 text-xs leading-relaxed line-clamp-2">{tool.short_description || tool.tldr}</p>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-display uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
          Start →
        </div>
      </div>
    </Link>
  );
}

export default function ToolList({ initialTools }: { initialTools: Tool[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const branchFilters = ['ALL', ...Array.from(new Set(initialTools.map(t => t.branch).filter(Boolean)))];

  const visible = activeFilter === 'ALL'
    ? initialTools
    : initialTools.filter(t => t.branch === activeFilter);

  const featured = visible.filter(t => t.featured);
  const rest = visible.filter(t => !t.featured);
  const mosaicItems = featured.length > 0 ? rest : visible;

  // Split into 2 columns for masonry
  const col1 = mosaicItems.filter((_, i) => i % 2 === 0);
  const col2 = mosaicItems.filter((_, i) => i % 2 === 1);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-4 border-b-2 border-black/10">
        {branchFilters.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {/* Carousel — featured */}
      {featured.length > 0 && (
        <div className="mb-2">
          <p className="label mb-4">Featured</p>
          <div
            className="flex gap-0 overflow-x-auto scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', gap: '2px' }}
          >
            {featured.map(tool => (
              <CarouselCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {/* Mosaic */}
      {mosaicItems.length > 0 && (
        <>
          {featured.length > 0 && <p className="label mt-8 mb-4">All tools</p>}
          <div className="grid grid-cols-2 bg-black" style={{ gap: '2px' }}>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              {col1.map((tool, i) => <MosaicCard key={tool.slug} tool={tool} tall={i % 3 === 0} />)}
            </div>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              {col2.map((tool, i) => <MosaicCard key={tool.slug} tool={tool} tall={i % 3 === 1} />)}
            </div>
          </div>
        </>
      )}

      {visible.length === 0 && (
        <div className="text-center py-16 border-2 border-black">
          <p className="text-black/40 font-display uppercase tracking-widest">No tools in this category</p>
        </div>
      )}
    </div>
  );
}
