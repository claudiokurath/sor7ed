"use client";

import { useState } from "react";
import Link from "next/link";

export default function ToolList({ initialTools }: { initialTools: any[] }) {
    const [search, setSearch] = useState("");

    const filteredTools = initialTools.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.branch?.toLowerCase().includes(search.toLowerCase()) ||
        tool.keyword?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative group max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search tools, templates, or keywords..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                    <div
                        key={tool.slug}
                        className="group relative bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden hover:bg-[#161616] transition-all duration-500 flex flex-col h-full"
                    >
                        {/* Tool Preview */}
                        <div className="h-48 w-full bg-white/5 relative overflow-hidden">
                            {tool.cover_image ? (
                                <img 
                                    src={tool.cover_image} 
                                    alt={tool.name} 
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <span className="text-6xl font-black uppercase tracking-tighter">{tool.branch}</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/70 uppercase tracking-widest">
                                    {tool.branch}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                            <h2 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                                {tool.name}
                            </h2>
                            <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                                {tool.tldr || tool.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">WhatsApp Keyword</p>
                                    <p className="font-mono font-bold text-white group-hover:text-yellow-400 transition-colors">{tool.keyword}</p>
                                </div>
                                <Link 
                                    href="/signup"
                                    className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all"
                                >
                                    →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredTools.length === 0 && (
                    <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                        <p className="text-white/20 italic text-xl">No tools match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
