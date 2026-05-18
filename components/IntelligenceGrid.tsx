"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FilterPill from "@/components/ui/FilterPill";

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

function CarouselCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/intelligence/${post.slug}`}
      className="group border-2 border-black hover:bg-ps-yellow transition-colors bg-white"
      style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 'clamp(220px, 55vw, 300px)' }}
    >
      <div className="relative overflow-hidden bg-black/5" style={{ aspectRatio: '3/4' }}>
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl text-black/10 uppercase">{(post.branch || 'A')[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4 border-t-2 border-black">
        <div className="flex items-center gap-2 mb-2">
          <span className="label-yellow">{post.branch || 'Article'}</span>
          {post.read_time && <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">{post.read_time} min</span>}
        </div>
        <h3 className="font-display uppercase text-sm text-black leading-tight line-clamp-2">{post.title}</h3>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-display uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">
          Read →
        </div>
      </div>
    </Link>
  );
}

function MosaicCard({ post, tall }: { post: Post; tall?: boolean }) {
  return (
    <Link
      href={`/intelligence/${post.slug}`}
      className="group block border-2 border-black hover:bg-ps-yellow transition-colors bg-white"
      style={{ breakInside: 'avoid', marginBottom: '2px' }}
    >
      {post.cover_image && (
        <div className="relative overflow-hidden bg-black/5 border-b-2 border-black" style={{ aspectRatio: tall ? '3/4' : '16/9' }}>
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="label-yellow">{post.branch || 'Article'}</span>
          {post.read_time && <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">{post.read_time} min</span>}
        </div>
        <h3 className="font-display uppercase text-xs text-black leading-tight mb-2">{post.title}</h3>
        <p className="text-black/45 text-xs leading-relaxed line-clamp-2">{post.summary || post.tldr || post.excerpt}</p>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-display uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
          Read →
        </div>
      </div>
    </Link>
  );
}

export default function IntelligenceGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const branchFilters = ['ALL', ...Array.from(new Set(posts.map(p => p.branch).filter(Boolean)))];

  const visible = activeFilter === 'ALL'
    ? posts
    : posts.filter(p => p.branch === activeFilter);

  const featured = visible.filter(p => p.featured);
  const rest = visible.filter(p => !p.featured);
  const mosaicItems = featured.length > 0 ? rest : visible;

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
          <p className="label mb-4">Featured reads</p>
          <div
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', gap: '2px' }}
          >
            {featured.map(post => (
              <CarouselCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Mosaic */}
      {mosaicItems.length > 0 && (
        <>
          {featured.length > 0 && <p className="label mt-8 mb-4">All articles</p>}
          <div className="grid grid-cols-2 bg-black" style={{ gap: '2px' }}>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              {col1.map((post, i) => <MosaicCard key={post.slug} post={post} tall={i % 3 === 0} />)}
            </div>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              {col2.map((post, i) => <MosaicCard key={post.slug} post={post} tall={i % 3 === 1} />)}
            </div>
          </div>
        </>
      )}

      {visible.length === 0 && (
        <div className="text-center py-16 border-2 border-black">
          <p className="text-black/40 font-display uppercase tracking-widest">No articles match</p>
        </div>
      )}
    </div>
  );
}
