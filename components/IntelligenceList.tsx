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
            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search by title, branch, or keyword..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button 
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {filteredPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/intelligence/${post.slug}`}
                        className="block border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">
                                {post.branch}
                            </span>
                            <div className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 font-mono">
                                <span className="text-xs text-white/40 uppercase tracking-widest">Text this →</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⚡</span>
                                    <span className="font-bold tracking-widest uppercase">{post.keyword}</span>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2 group-hover:text-white/80 transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed">{post.tldr || post.excerpt || post.description}</p>
                    </Link>
                ))}
                
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-white/30 italic">No protocols match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
