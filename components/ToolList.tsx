"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ToolList({ initialTools }: { initialTools: any[] }) {
    const [search, setSearch] = useState("");

    const filteredTools = initialTools.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.branch?.toLowerCase().includes(search.toLowerCase()) ||
        tool.keyword?.toLowerCase().includes(search.toLowerCase())
    );

    const featuredTools = filteredTools.filter(tool => tool.featured);
    const regularTools = filteredTools.filter(tool => !tool.featured);

    return (
        <div className="space-y-16">
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

            {/* Featured Assessments */}
            {featuredTools.length > 0 && (
                <div>
                    <h2 className="text-white/30 text-xs uppercase tracking-[0.3em] font-bold mb-8">Featured Assessments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredTools.map((tool) => (
                            <ToolCard key={tool.slug} tool={tool} featured={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Assessments */}
            <div>
                {featuredTools.length > 0 && (
                    <h2 className="text-white/30 text-xs uppercase tracking-[0.3em] font-bold mb-8">All Assessments</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularTools.map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} featured={false} />
                    ))}
                    
                    {filteredTools.length === 0 && (
                        <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                            <p className="text-white/20 italic text-xl">No assessments found for "{search}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToolCard({ tool, featured }: { tool: any, featured: boolean }) {
    const color = tool.color || '#3B82F6';

    return (
        <Link
            href={`/tools/${tool.slug}`}
            className={`relative flex flex-col p-8 rounded-[2.5rem] border border-white/10 bg-[#111111] hover:bg-[#161616] transition-all duration-500 overflow-hidden group ${
                featured ? 'h-[450px]' : 'h-[400px]'
            }`}
        >
            <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-20" 
                style={{ backgroundColor: color, transform: 'translate(25%, -25%)' }}
            />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <span 
                        className="text-[10px] px-3 py-1 rounded-full tracking-[0.2em] uppercase font-bold border"
                        style={{ 
                            backgroundColor: `${color}20`, 
                            color: color,
                            borderColor: `${color}40`
                        }}
                    >
                        {tool.branch}
                    </span>
                    {featured && (
                        <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 text-white/60 font-bold uppercase tracking-widest">
                            FEATURED
                        </span>
                    )}
                </div>
                
                <div className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 font-mono">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Text this →</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">⚡</span>
                        <span className="font-bold tracking-widest text-sm" style={{ color: tool.color || '#ffffff' }}>
                            {tool.keyword}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 mt-auto">
                <h2 className="text-2xl font-black mb-4 group-hover:text-white transition-colors leading-tight tracking-tight">
                    {tool.name}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-3">
                    {tool.short_description || tool.tldr || tool.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>
                    Start Assessment <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
}
