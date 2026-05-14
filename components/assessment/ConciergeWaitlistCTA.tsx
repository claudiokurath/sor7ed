import Link from 'next/link';

interface ConciergeWaitlistCTAProps {
  branch: string;
  sourceToolSlug: string;
  branchColor: string;
}

export function ConciergeWaitlistCTA({ branch, sourceToolSlug, branchColor }: ConciergeWaitlistCTAProps) {
  return (
    <section className="max-w-2xl mx-auto w-full mt-16 px-4">
      <div
        className="rounded-3xl border border-white/10 p-8 bg-white/[0.03]"
        style={{ borderLeftColor: branchColor, borderLeftWidth: 3 }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 font-bold">
          {branch} · Concierge
        </p>
        <h2 className="text-xl font-black text-white mb-3 tracking-tight">
          Want a human expert to build your protocol?
        </h2>
        <p className="text-white/40 text-sm leading-relaxed mb-6">
          The SOR7ED Concierge takes your assessment results and crafts a bespoke, step-by-step protocol with you over WhatsApp.
        </p>
        <Link
          href={`/concierge?source=${sourceToolSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-black transition-all hover:scale-105"
          style={{ backgroundColor: branchColor }}
        >
          Learn about Concierge →
        </Link>
      </div>
    </section>
  );
}
