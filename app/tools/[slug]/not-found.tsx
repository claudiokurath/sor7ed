// app/tools/[slug]/not-found.tsx
import Link from "next/link";

export default function ToolNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col 
                   items-center justify-center px-6 text-center pt-20 font-roboto font-thin">
      <div className="max-w-md mx-auto space-y-8">
        {/* Status indicator */}
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 
                       flex items-center justify-center mx-auto">
          <span className="text-3xl">🔍</span>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-anton tracking-wider">
            Signal Lost
          </p>
          <h1 className="text-3xl md:text-4xl font-anton tracking-wider text-white leading-tight uppercase">
            This diagnostic doesn't exist.
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Either it got moved, I'm still building it, or the link is broken. 
            Either way, there's plenty more where that came from.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center px-8 py-4 
                       rounded-xl font-anton tracking-wider text-black bg-[#ff7a45] 
                       text-sm hover:scale-105 transition-all duration-300
                       shadow-[0_0_20px_rgba(255,122,69,0.2)] uppercase"
          >
            See all diagnostics →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 
                       rounded-xl font-anton tracking-wider text-white/60 
                       border border-white/10 text-sm 
                       hover:text-white hover:border-white/30 
                       transition-all duration-300 uppercase"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
