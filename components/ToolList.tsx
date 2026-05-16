"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
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
  cover_image?: string;
  featured: boolean;
};

export default function ToolList({ initialTools }: { initialTools: Tool[] }) {
    const [search, setSearch] = useState("");

    const filteredTools = initialTools.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.branch?.toLowerCase().includes(search.toLowerCase()) ||
        tool.keyword?.toLowerCase().includes(search.toLowerCase())
    );

    const featuredTools = filteredTools.filter(tool => tool.featured);
    const regularTools = filteredTools.filter(tool => !tool.featured);

    return (
        <div className="space-y-10">
            {/* Search Bar */}
            <div className="relative group max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search assessments, categories, or keywords..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                ))}

                {filteredTools.length === 0 && (
                    <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-white/20 italic text-xl">No assessments found for &quot;{search}&quot;.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToolCard({ tool }: { tool: Tool }) {
    const color = tool.color || '#3B82F6';

    return (
        <Link
            href={`/tools/${tool.slug}`}
            className="relative flex flex-col rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
            style={{ '--glow-color': color } as CSSProperties}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                    border: `1.5px solid ${color}45`,
                    boxShadow: `0 0 30px ${color}20`,
                    background: `radial-gradient(ellipse at 60% 0%, ${color}08, transparent 65%)`,
                }}
            />

            {/* Cover image */}
            <div className="w-full h-44 shrink-0 overflow-hidden rounded-t-3xl">
                {tool.cover_image ? (
                    <img
                        src={tool.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${color}28 0%, #0a0a0a 100%)` }}
                    >
                        <span className="text-6xl font-black opacity-10 tracking-tight" style={{ color }}>
                            {tool.branch?.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span
                        className="text-[10px] px-3 py-1 rounded-full tracking-[0.2em] uppercase font-bold border"
                        style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
                    >
                        {tool.branch}
                    </span>
                    <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>
                        ⚡ {tool.keyword}
                    </span>
                </div>

                <h2 className="text-lg font-black mb-2 group-hover:text-white/80 transition-colors leading-tight tracking-tight">
                    {tool.name}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {tool.short_description || tool.tldr || tool.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.2em] pt-4 border-t border-white/[0.06]" style={{ color }}>
                    Start Assessment <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
}
