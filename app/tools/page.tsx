import { BranchGrid } from '@/components/BranchGrid';
import { SITE_COPY } from '@/lib/copy-matrix';
import Link from 'next/link';
import Image from 'next/image';

export default async function ToolsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="px-6 py-12 pt-24">
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-16 pt-4">
          <Link href="/">
            <Image src="/Images/Logo2026.png" alt="SOR7ED" width={216} height={84} className="h-20 w-auto opacity-20 hover:opacity-50 transition-opacity" />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/signup" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
              Sign In →
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {SITE_COPY.lab.title}
          </h1>
          <p className="text-xl text-white/60 mb-12">
            {SITE_COPY.lab.tagline}
          </p>
        </div>
      </section>

      <BranchGrid />

      <div className="border-t border-white/10 mt-32 py-24 text-center px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          {SITE_COPY.premium.title}
        </h2>
        <p className="text-white/40 mb-10 max-w-md mx-auto text-lg leading-relaxed">
          {SITE_COPY.premium.tagline}
        </p>
        <div className="space-y-4">
          <Link
            href="/signup"
            className="inline-block bg-yellow-500 text-black font-bold px-10 py-5 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Start Free Trial →
          </Link>
          <p className="text-xs text-white/30">
            {SITE_COPY.premium.trial}
          </p>
        </div>
      </div>
    </main>
  );
}
