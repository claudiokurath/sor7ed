import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[#2e2a22]">
      <div className="page-container py-8 flex items-center justify-between flex-wrap gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8c8473" }}>
        <span>© 2026 · SOR7ED Limited · Skip the nonsense</span>
        <div className="flex items-center gap-6">
          <Link href="/articles" className="hover:text-[#d4af37] transition-colors">Articles</Link>
          <Link href="/tools" className="hover:text-[#d4af37] transition-colors">Tools</Link>
          <Link href="/explore" className="hover:text-[#d4af37] transition-colors">Explore</Link>
          <Link href="/terms" className="hover:text-[#d4af37] transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-[#d4af37] transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
