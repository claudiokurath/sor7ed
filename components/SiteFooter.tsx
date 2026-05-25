import Link from 'next/link';

const NAVIGATE = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/intelligence', label: 'Articles' },
  { href: '/explore', label: '7 Branches' },
  { href: '/dashboard', label: 'Account' },
];

const COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050c0e]">

      {/* Branch banner image strip */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        <img
          src="/Images/banners/7 branches banner.png"
          alt="SOR7ED — 7 Branches"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050c0e] via-[#050c0e]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050c0e]/60 via-transparent to-[#050c0e]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">Practical protocols for</p>
            <div className="flex items-center gap-0">
              <span className="font-display text-4xl md:text-5xl tracking-widest uppercase text-[#f0ede8]">SOR</span>
              <span className="font-display text-4xl md:text-5xl tracking-widest uppercase text-[#00C4C4]">7</span>
              <span className="font-display text-4xl md:text-5xl tracking-widest uppercase text-[#f0ede8]">ED</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">neurodivergent minds</p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 pt-16 pb-32 md:pb-16">
        <div className="max-w-6xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/8">

          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center mb-5">
              <span className="font-display text-2xl tracking-widest uppercase text-[#f0ede8]">SOR</span>
              <span className="font-display text-2xl tracking-widest uppercase text-[#00C4C4]">7</span>
              <span className="font-display text-2xl tracking-widest uppercase text-[#f0ede8]">ED</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6 font-sans">
              Practical protocols for neurodivergent minds — delivered to your WhatsApp. No app, no subscription needed.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@sor7ed.com"
                className="text-[#00C4C4] text-xs font-mono uppercase tracking-widest hover:text-white transition-colors"
              >
                hello@sor7ed.com
              </a>
              <span className="text-white/25 text-xs font-mono uppercase tracking-widest">United Kingdom</span>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-5">Navigate</p>
            <ul className="space-y-3">
              {NAVIGATE.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/50 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-5">Company</p>
            <ul className="space-y-3">
              {COMPANY.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/50 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-white/25 text-[10px] font-mono uppercase tracking-widest">
            © 2026 SOR7ED. All rights reserved.
          </span>
          <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.15em]">
            Neurodivergent-first · UK-based · WhatsApp-delivered
          </span>
        </div>
        </div>
      </div>
    </footer>
  );
}
