"use client";

import { useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  branch: string;
  keyword: string;
  tldr: string;
  excerpt: string;
  description: string;
};

export default function IntelligenceList({ initialPosts }: { initialPosts: Post[] }) {
    const [search, setSearch] = useState("");

    const filteredPosts = initialPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.branch?.toLowerCase().includes(search.toLowerCase()) ||
        post.keyword?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Search Bar - Brutalist Design */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-ps-yellow transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="SEARCH BY TITLE, BRANCH, OR KEYWORD..." 
                    className="input pl-12 uppercase"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button 
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                )}
            </div>

            {/* List - Brutalist Grid/Stack */}
            <div className="space-y-6">
                {filteredPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/intelligence/${post.slug}`}
                        className="card-interactive p-6 block group"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="label-yellow">
                                    {post.branch}
                                </span>
                                <span className="label">
                                    ID: {post.id.slice(0, 8)}
                                </span>
                            </div>
                            
                            {/* Keyword Stamp */}
                            <div className="bg-black border-2 border-white px-4 py-2 font-mono shadow-hard-white group-hover:shadow-hard-yellow group-hover:border-ps-yellow transition-all">
                                <span className="label text-white/40 block mb-1">WHATSAPP KEYWORD</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⚡</span>
                                    <span className="font-bold tracking-widest uppercase text-white group-hover:text-ps-yellow">{post.keyword}</span>
                                </div>
                            </div>
                        </div>
                        
                        <h2 className="display-sm mb-3 text-white group-hover:text-ps-yellow transition-colors">
                            {post.title}
                        </h2>
                        
                        <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                            {post.tldr || post.excerpt || post.description}
                        </p>
                        
                        <div className="mt-4 flex items-center text-xs font-bold text-ps-yellow group-hover:text-white transition-colors">
                            <span>ACCESS FULL BRIEFING</span>
                            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </Link>
                ))}
                
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-white/20">
                        <p className="text-white/30 font-mono uppercase">No protocols match your query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
