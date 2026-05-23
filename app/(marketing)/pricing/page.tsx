import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="pt-16">
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20 text-center">
          <p className="t-label text-accent mb-4">Pricing</p>
          <h1 className="t-display mb-5 text-balance">
            Simple, transparent pricing.
          </h1>
          <p className="t-body max-w-lg mx-auto text-pretty">
            Start free. Upgrade when you need more. No subscriptions, no lock-in.
          </p>
        </div>
      </div>

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
    </div>
  );
}
