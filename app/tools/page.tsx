import { BranchGrid } from '@/components/BranchGrid';
import { SITE_COPY } from '@/lib/copy-matrix';
import Link from 'next/link';
import Image from 'next/image';

export default async function ToolsPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pt-20 font-roboto font-thin">
      {/* HERO SECTION */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mt-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffd107]/80 font-anton tracking-wider mb-6">
            The Lab
          </p>
          <h1 className="text-4xl md:text-6xl font-anton tracking-wider mb-6 uppercase leading-[1.1]">
            {SITE_COPY.lab.title}
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            {SITE_COPY.lab.tagline}
          </p>
        </div>
      </section>

      {/* BRANCH SELECTION */}
      <div className="px-4 sm:px-6 md:px-16 mb-20">
        <div className="flex items-center gap-4 mb-12 max-w-7xl mx-auto">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-anton tracking-wider shrink-0">
            Select Your Branch
          </p>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <BranchGrid />
      </div>

      {/* PREMIUM CTA */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto py-24 px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffd107] mb-6 font-anton tracking-wider">
            Upgrade Your System
          </p>
          <h2 className="text-3xl md:text-5xl font-anton tracking-wider mb-6 uppercase leading-tight">
            {SITE_COPY.premium.title}
          </h2>
          <p className="text-white/40 mb-10 max-w-md mx-auto text-lg leading-relaxed">
            {SITE_COPY.premium.tagline}
          </p>
          <div className="space-y-6">
            <Link
              href="/signup"
              className="inline-flex items-center px-10 py-5 rounded-full font-anton tracking-wider text-black bg-[#ffd107] hover:bg-white hover:scale-105 transition-all duration-300 text-sm uppercase shadow-[0_0_20px_rgba(255,209,7,0.2)]"
            >
              Start Free Trial →
            </Link>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">
              {SITE_COPY.premium.trial}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
