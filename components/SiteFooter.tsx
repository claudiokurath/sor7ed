import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-line)] bg-[var(--color-surface)]/20 mt-16">
      <div className="page-container py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Left Column: Tagline */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-sans font-black text-xl tracking-[0.02em] text-[var(--color-bone)] uppercase">
            SOR<span className="text-[var(--color-accent)]">7</span>ED
          </Link>
          <p className="text-[13px] leading-relaxed text-[var(--color-muted)] max-w-xs">
            Practical protocols for neurodivergent minds — delivered to your WhatsApp. No app, no nonsense.
          </p>
        </div>

        {/* Column 1: Explore */}
        <div className="flex flex-col gap-4">
          <span className="t-mono text-[10px] font-bold text-[var(--color-bone)]">Explore</span>
          <div className="flex flex-col gap-2 text-[13px] text-[var(--color-muted)]">
            <Link href="#branches" className="hover:text-[var(--color-accent)] transition-colors">The 7 Branches</Link>
            <Link href="/tools" className="hover:text-[var(--color-accent)] transition-colors">Tools</Link>
            <Link href="/articles" className="hover:text-[var(--color-accent)] transition-colors">Intelligence</Link>
            <Link href="#how-it-works" className="hover:text-[var(--color-accent)] transition-colors">How it works</Link>
          </div>
        </div>

        {/* Column 2: Start */}
        <div className="flex flex-col gap-4">
          <span className="t-mono text-[10px] font-bold text-[var(--color-bone)]">Start</span>
          <div className="flex flex-col gap-2 text-[13px] text-[var(--color-muted)]">
            <Link href="#signup" className="hover:text-[var(--color-accent)] transition-colors">Create free account</Link>
            <Link href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started." className="hover:text-[var(--color-accent)] transition-colors">Get on WhatsApp</Link>
            <Link href="#tools" className="hover:text-[var(--color-accent)] transition-colors">ADHD Tax Calculator</Link>
          </div>
        </div>

        {/* Column 3: Studio */}
        <div className="flex flex-col gap-4">
          <span className="t-mono text-[10px] font-bold text-[var(--color-bone)]">Studio</span>
          <div className="flex flex-col gap-2 text-[13px] text-[var(--color-muted)]">
            <Link href="/about" className="hover:text-[var(--color-accent)] transition-colors">About</Link>
            <a href="mailto:hello@sor7ed.com" className="hover:text-[var(--color-accent)] transition-colors">Contact</a>
            <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors">Privacy</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-line)]/40 py-6">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="t-mono text-[10.5px] text-[var(--color-muted)]">
            © 2026 SOR7ED · Founder-led, privacy-conscious — "Skip the nonsense."
          </span>
          <div className="flex items-center gap-4 text-[11px] text-[var(--color-muted)]">
            <Link href="/terms" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
