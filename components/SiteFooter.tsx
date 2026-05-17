import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t-4 border-ps-black bg-ps-white px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-4">

          <div className="md:col-span-2">
            <h3 className="font-anton text-3xl tracking-wider uppercase text-ps-black mb-4">SOR7ED</h3>
            <p className="text-ps-gray-600 leading-relaxed mb-6 max-w-md">
              Practical protocols for neurodivergent adults. We build the systems and tools
              that work with your brain, not against it.
            </p>
            <div className="flex gap-4">
              <Link href="/intelligence" className="text-ps-gray-500 hover:text-ps-black text-sm font-bold uppercase tracking-widest transition-colors">
                Articles
              </Link>
              <Link href="/signup?mode=login" className="text-ps-gray-500 hover:text-ps-black text-sm font-bold uppercase tracking-widest transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-ps-black font-black mb-4 text-xs uppercase tracking-widest">
              How It Works
            </h4>
            <div className="space-y-3 text-sm text-ps-gray-600">
              <p>1. Find your situation in our 7 branches</p>
              <p>2. Complete a 2-minute assessment</p>
              <p>3. Sign up and get protocols on WhatsApp</p>
              <p>4. Text keywords anytime for instant help</p>
            </div>
          </div>

          <div>
            <h4 className="text-ps-black font-black mb-4 text-xs uppercase tracking-widest">
              Safety & Privacy
            </h4>
            <div className="space-y-2 text-sm text-ps-gray-600">
              <p>No protocol content on website</p>
              <p>WhatsApp delivery only</p>
              <p>Text STOP anytime to unsubscribe</p>
              <p>Your data stays secure</p>
            </div>
          </div>

        </div>

        <div className="border-t-2 border-ps-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ps-gray-500 text-xs font-bold uppercase tracking-widest">
            © 2026 SOR7ED. Built for minds that work differently.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="text-ps-gray-400 hover:text-ps-black text-xs font-bold uppercase tracking-widest transition-colors">Privacy</Link>
            <Link href="/terms" className="text-ps-gray-400 hover:text-ps-black text-xs font-bold uppercase tracking-widest transition-colors">Terms</Link>
            <Link href="/cookies" className="text-ps-gray-400 hover:text-ps-black text-xs font-bold uppercase tracking-widest transition-colors">Cookies</Link>
            <span className="text-ps-gray-400 text-xs font-bold uppercase tracking-widest">hello@sor7ed.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
