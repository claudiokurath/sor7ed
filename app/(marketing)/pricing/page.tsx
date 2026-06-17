import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">PRICING</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            Simple, transparent pricing.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            Start free. Upgrade when you need more. No subscriptions, no lock-in.
          </p>
        </div>
      </section>

      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="card p-6 sm:p-8">
            <p className="t-label mb-3">Free</p>
            <p className="font-display text-4xl font-medium tracking-tight mb-1">£0</p>
            <p className="t-small mb-8">Forever free to start</p>
            <ul className="space-y-3 mb-8">
              {[
                "5 free tool runs",
                "Unlimited saves",
                "All 7 areas of life",
                "WhatsApp delivery",
                "All articles"
              ].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <span className="text-accent" aria-hidden="true">✓</span>
                  <span className="t-body">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/tools" className="btn btn-ghost w-full justify-center">
              Get started free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="card p-6 sm:p-8 border-accent/30 bg-accent-dim">
            <div className="flex items-center justify-between mb-3">
              <p className="t-label">Unlimited</p>
              <span className="tag tag-accent">Most popular</span>
            </div>
            <p className="font-display text-4xl font-medium tracking-tight mb-1">£9</p>
            <p className="t-small mb-8">One-time payment</p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited tool runs",
                "Unlimited saves",
                "All 7 areas of life",
                "WhatsApp delivery",
                "All articles",
                "Priority support"
              ].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <span className="text-accent" aria-hidden="true">✓</span>
                  <span className="t-body">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/447591922247?text=UPGRADE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent w-full justify-center"
            >
              Unlock unlimited →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
