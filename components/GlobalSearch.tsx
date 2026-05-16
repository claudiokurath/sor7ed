"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "tool" | "article";
  title: string;
  description: string;
  url: string;
  category: string;
  keyword?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Keep Going":   "🚀",
  "Feel Good":    "🧠",
  "Spend Smart":  "💰",
  "Be Connected": "🤝",
  "Plan Ahead":   "📅",
  "Be Yourself":  "🌈",
  "Level Up":     "⚡",
};

const WA_BASE = "https://wa.me/447591922247";

const QUICK_ACTIONS = [
  { label: "Can't focus",        whatsapp: "START",   icon: "🧠" },
  { label: "Overwhelmed",        whatsapp: "SORT",    icon: "🌪️" },
  { label: "Burnt out",          whatsapp: "BURNOUT", icon: "😴" },
  { label: "Money stress",       whatsapp: "DEBT",    icon: "💸" },
  { label: "Can't sleep",        whatsapp: "SLEEP",   icon: "🌙" },
  { label: "Hard conversation",  whatsapp: "PEOPLE",  icon: "😤" },
];

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setActiveIndex(0);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, performSearch]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      window.location.href = results[activeIndex].url;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed top-0 left-0 right-0 z-[101] flex justify-center px-4 pt-16 md:pt-24">
        <div className="w-full max-w-2xl animate-slide-up">

          {/* Input */}
          <div className="relative mb-2">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search tools, articles, keywords..."
              className="w-full bg-[#111] border border-white/20 rounded-2xl pl-14 pr-14 py-5 text-white text-lg placeholder-zinc-600 focus:outline-none focus:border-[#FFC107]/60 focus:ring-2 focus:ring-[#FFC107]/10 transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {loading ? (
                <svg className="w-5 h-5 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : query ? (
                <button onClick={() => setQuery("")} className="text-zinc-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          {/* Panel */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/80">

            {/* Empty state */}
            {!query && (
              <div className="p-6">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4 px-2">What&apos;s going on?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {QUICK_ACTIONS.map(action => (
                    <a
                      key={action.whatsapp}
                      href={`${WA_BASE}?text=${encodeURIComponent(action.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all group"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium group-hover:text-white transition-colors truncate">{action.label}</p>
                        <p className="text-xs text-[#FFC107] font-mono">{action.whatsapp}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/8">
                  <a
                    href={`${WA_BASE}?text=${encodeURIComponent("HELP")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
                  >
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="text-green-400 font-bold text-sm group-hover:text-green-300 transition-colors">Text HELP on WhatsApp</p>
                      <p className="text-zinc-500 text-xs">Get the full list of available tools</p>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Results */}
            {query && results.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                {results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={onClose}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 transition-all group ${
                      index === activeIndex
                        ? "bg-[#FFC107]/5 border-l-2 border-l-[#FFC107]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {CATEGORY_ICONS[result.category] || "🛠️"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${result.type === "tool" ? "badge-brand" : "badge-purple"}`}>
                          {result.type}
                        </span>
                        <span className="text-zinc-600 text-xs">{result.category}</span>
                        {result.keyword && (
                          <span className="text-[#FFC107] font-mono text-xs font-bold">{result.keyword}</span>
                        )}
                      </div>
                      <p className="text-white font-semibold text-sm mb-1 truncate group-hover:text-[#FFC107] transition-colors">
                        {result.title}
                      </p>
                      <p className="text-zinc-500 text-xs truncate">{result.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {query && !loading && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-zinc-500 text-sm mb-4">
                  No results for &ldquo;<span className="text-white font-semibold">{query}</span>&rdquo;
                </p>
                <a
                  href={`${WA_BASE}?text=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm inline-flex"
                >
                  💬 Ask on WhatsApp
                </a>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4 text-zinc-700 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-xs">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-xs">↵</kbd> Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-xs">Esc</kbd> Close
                </span>
              </div>
              <span className="text-zinc-700 text-xs">SOR7ED</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
