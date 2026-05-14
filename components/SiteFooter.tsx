import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 px-6 md:px-16 py-16 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-4">
          
          <div className="md:col-span-2">
            <div className="mb-5">
              <Image src="/Images/Logo2026.png" alt="SOR7ED" width={120} height={48} className="h-10 w-auto" />
            </div>
            <p className="text-white/50 leading-relaxed mb-6 max-w-md">
              Practical protocols for neurodivergent adults. We build the systems and tools 
              that work with your brain, not against it.
            </p>
            <div className="flex gap-4">
              <Link href="/tools" className="text-white/40 hover:text-white text-sm transition-colors">
                Assessments
              </Link>
              <Link href="/blog" className="text-white/40 hover:text-white text-sm transition-colors">
                Articles
              </Link>
              <Link href="/signup?mode=login" className="text-white/40 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white/60 font-semibold mb-4 text-xs uppercase tracking-widest">
              How It Works
            </h4>
            <div className="space-y-3 text-sm text-white/50">
              <p>1. Find your situation in our 7 branches</p>
              <p>2. Complete a 2-minute assessment</p>
              <p>3. Sign up and get protocols on WhatsApp</p>
              <p>4. Text keywords anytime for instant help</p>
            </div>
          </div>

          <div>
            <h4 className="text-white/60 font-semibold mb-4 text-xs uppercase tracking-widest">
              Safety & Privacy
            </h4>
            <div className="space-y-2 text-sm text-white/50">
              <p>✓ No protocol content on website</p>
              <p>✓ WhatsApp delivery only</p>
              <p>✓ Text STOP anytime to unsubscribe</p>
              <p>✓ Your data stays secure</p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 SOR7ED. Built for minds that work differently.
          </p>
          <p className="text-white/30 text-xs">
            Questions? We&apos;re here to help: hello@sor7ed.com
          </p>
        </div>
      </div>
    </footer>
  );
}
