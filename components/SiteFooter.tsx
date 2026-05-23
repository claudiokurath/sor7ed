import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-white/10 bg-black px-6 md:px-16 pt-8 pb-28 md:py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg tracking-widest uppercase text-white">
            SOR<span className="bg-ps-yellow px-0.5 text-black">7</span>ED
          </span>
          <span className="text-white/30 text-xs font-display uppercase tracking-widest">© 2026</span>
          <a href="mailto:hello@sor7ed.com" className="text-white/30 hover:text-white text-xs font-display uppercase tracking-widest transition-colors">
            hello@sor7ed.com
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-white/30 hover:text-white text-xs font-display uppercase tracking-widest transition-colors">Privacy</Link>
          <Link href="/terms"   className="text-white/30 hover:text-white text-xs font-display uppercase tracking-widest transition-colors">Terms</Link>
          <Link href="/cookies" className="text-white/30 hover:text-white text-xs font-display uppercase tracking-widest transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
