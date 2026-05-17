import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="hidden md:block mt-20 border-t-2 border-ps-white bg-ps-black px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-4">

          <div className="md:col-span-2">
            <h3 className="font-display text-3xl tracking-widest uppercase text-ps-white mb-1">
              SOR<span className="text-ps-yellow">7</span>ED
            </h3>
            <p className="text-ps-white/50 leading-relaxed mb-6 max-w-md text-sm mt-4">
              Practical protocols for neurodivergent adults. We build the systems and tools
              that work with your brain, not against it.
            </p>
            <div className="flex gap-4">
              <Link href="/intelligence" className="text-ps-white/50 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">
                Articles
              </Link>
              <Link href="/signup?mode=login" className="text-ps-white/50 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-ps-white font-display mb-4 text-xs uppercase tracking-widest">
              How It Works
            </h4>
            <div className="space-y-3 text-sm text-ps-white/50">
              <p>1. Find your situation in our 7 branches</p>
              <p>2. Complete a 2-minute assessment</p>
              <p>3. Sign up and get protocols on WhatsApp</p>
              <p>4. Text keywords anytime for instant help</p>
            </div>
          </div>

          <div>
            <h4 className="text-ps-white font-display mb-4 text-xs uppercase tracking-widest">
              Safety & Privacy
            </h4>
            <div className="space-y-2 text-sm text-ps-white/50">
              <p>No protocol content on website</p>
              <p>WhatsApp delivery only</p>
              <p>Text STOP anytime to unsubscribe</p>
              <p>Your data stays secure</p>
            </div>
          </div>

        </div>

        <div className="border-t-2 border-ps-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ps-white/40 text-xs font-display uppercase tracking-widest">
            © 2026 SOR7ED. Built for minds that work differently.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="text-ps-white/40 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Privacy</Link>
            <Link href="/terms" className="text-ps-white/40 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Terms</Link>
            <Link href="/cookies" className="text-ps-white/40 hover:text-ps-yellow text-xs font-display uppercase tracking-widest transition-colors">Cookies</Link>
            <span className="text-ps-white/40 text-xs font-display uppercase tracking-widest">hello@sor7ed.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
