"use client";

import { useState } from "react";
import Link from "next/link";
import FilterPill from "@/components/ui/FilterPill";
import SaveToPhoneButton from "@/components/SaveToPhoneButton";

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

// Large hero card — used for the first (or featured) tool
function HeroToolCard({ tool }: { tool: Tool }) {
  const preview = tool.short_description || tool.tldr;
  return (
    <div className="border-b-2 border-black grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Image */}
      {tool.cover_image ? (
        <div className="h-64 lg:h-auto overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-black">
          <img
            src={tool.cover_image}
            alt={tool.name}
            className="w-full h-full object-cover"
            style={{ minHeight: "100%" }}
          />
        </div>
      ) : (
        <div className="hidden lg:flex h-64 lg:h-auto bg-ps-yellow border-r-2 border-black items-end p-10">
          <span
            className="font-display uppercase text-black/10 leading-none"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
          >
            {tool.branch}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col p-7 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="label-yellow">{tool.branch}</span>
          <span className="text-black/30 text-[9px] font-display uppercase tracking-wider">Assessment</span>
        </div>

        <h2
          className="font-display uppercase text-black leading-tight mb-5 flex-1"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", letterSpacing: "-0.01em" }}
        >
          {tool.name}
        </h2>

        <p className="text-black/55 text-sm leading-relaxed line-clamp-4 mb-8">
          {preview}
        </p>

        <div className="flex items-center justify-between border-t-2 border-black pt-5 mt-auto">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
          >
            Start assessment →
          </Link>
          <SaveToPhoneButton
            title={tool.name}
            summary={preview || undefined}
            pageUrl={`/tools/${tool.slug}`}
            size="sm"
            label="Save"
          />
        </div>
      </div>
    </div>
  );
}

// Standard card — remaining tools
function ToolCard({ tool }: { tool: Tool }) {
  const preview = tool.short_description || tool.tldr;
  return (
    <div className="border-2 border-black flex flex-col bg-white">
      {/* Cover image */}
      {tool.cover_image ? (
        <div className="h-44 overflow-hidden border-b-2 border-black">
          <img
            src={tool.cover_image}
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-1 bg-ps-yellow" />
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-yellow">{tool.branch}</span>
        </div>
        <h3 className="font-display uppercase text-base text-black leading-tight mb-2 flex-1">
          {tool.name}
        </h3>
        <p className="text-black/50 text-sm leading-relaxed line-clamp-3 mt-1">
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t-2 border-black px-5 py-3">
        <Link
          href={`/tools/${tool.slug}`}
          className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
        >
          Start assessment →
        </Link>
        <SaveToPhoneButton
          title={tool.name}
          summary={preview || undefined}
          pageUrl={`/tools/${tool.slug}`}
          size="sm"
          label="Save"
        />
      </div>
    </div>
  );
}

export default function ToolList({ initialTools }: { initialTools: Tool[] }) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const branchFilters = ["ALL", ...Array.from(new Set(initialTools.map(t => t.branch).filter(Boolean)))];

  const visible = activeFilter === "ALL"
    ? initialTools
    : initialTools.filter(t => t.branch === activeFilter);

  // Featured tool first, then the rest
  const hero = visible.find(t => t.featured) ?? visible[0];
  const rest = hero ? visible.filter(t => t.slug !== hero.slug) : [];

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
          <p className="text-black/40 font-display uppercase tracking-widest">No tools in this category</p>
        </div>
      ) : (
        <>
          {/* Hero tool */}
          {hero && <HeroToolCard tool={hero} />}

          {/* Grid — remaining tools */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {rest.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
