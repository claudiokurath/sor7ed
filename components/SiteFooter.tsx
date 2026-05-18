import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-black bg-white px-6 md:px-16 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg tracking-widest uppercase text-black">
            SOR<span className="bg-ps-yellow px-0.5">7</span>ED
          </span>
          <span className="text-black/25 text-xs font-display uppercase tracking-widest">© 2026</span>
          <a href="mailto:hello@sor7ed.com" className="text-black/25 hover:text-black text-xs font-display uppercase tracking-widest transition-colors">
            hello@sor7ed.com
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-black/25 hover:text-black text-xs font-display uppercase tracking-widest transition-colors">Privacy</Link>
          <Link href="/terms"   className="text-black/25 hover:text-black text-xs font-display uppercase tracking-widest transition-colors">Terms</Link>
          <Link href="/cookies" className="text-black/25 hover:text-black text-xs font-display uppercase tracking-widest transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
