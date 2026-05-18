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

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="border-2 border-black flex flex-col bg-white">
      {/* Colour band */}
      <div className="h-1 bg-ps-yellow" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <span className="label-yellow mb-3 inline-block">{tool.branch}</span>
        <h3 className="font-display uppercase text-base text-black leading-tight mb-2">
          {tool.name}
        </h3>
        <p className="text-black/50 text-sm leading-relaxed flex-1 line-clamp-3">
          {tool.short_description || tool.tldr}
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
          summary={tool.short_description || tool.tldr || undefined}
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
          <p className="text-black/40 font-display uppercase tracking-widest">No tools in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      )}
    </div>
  );
}
