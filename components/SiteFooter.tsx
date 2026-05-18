import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="hidden md:block border-t border-ps-white/10 bg-ps-black px-6 md:px-16 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg tracking-widest uppercase text-ps-white">
            SOR<span className="text-ps-yellow">7</span>ED
          </span>
          <span className="text-ps-white/25 text-xs font-display uppercase tracking-widest">© 2026</span>
          <a href="mailto:hello@sor7ed.com" className="text-ps-white/25 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">
            hello@sor7ed.com
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-ps-white/25 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Privacy</Link>
          <Link href="/terms"   className="text-ps-white/25 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Terms</Link>
          <Link href="/cookies" className="text-ps-white/25 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
