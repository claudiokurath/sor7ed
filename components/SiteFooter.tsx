import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-black border-t border-black-border py-16">
      <div className="container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-display text-2xl font-bold text-gold tracking-[0.2em] mb-4">
              SOR7ED
            </div>
            <p className="text-gray-muted text-sm leading-relaxed max-w-xs">
              Practical protocols for neurodivergent minds. Not therapy. Not medical 
              advice. Not a crisis service.
            </p>
          </div>

          <div>
            <div className="font-display text-sm font-semibold text-white tracking-[0.2em] uppercase mb-6">
              The Branches
            </div>
            <ul className="space-y-3">
              {[
                'Keep Going',
                'Feel Good', 
                'Spend Smart',
                'Be Connected',
                'Plan Ahead',
                'Be Yourself',
                'Level Up'
              ].map((branch) => (
                <li key={branch}>
                  <Link 
                    href={`/intelligence?branch=${encodeURIComponent(branch)}`}
                    className="text-gray-muted hover:text-gold transition-colors text-sm"
                  >
                    {branch}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-display text-sm font-semibold text-white tracking-[0.2em] uppercase mb-6">
              Platform
            </div>
            <ul className="space-y-3">
              <li><Link href="/intelligence" className="text-gray-muted hover:text-gold transition-colors text-sm">Articles</Link></li>
              <li><Link href="/dashboard" className="text-gray-muted hover:text-gold transition-colors text-sm">Dashboard</Link></li>
              <li><Link href="/signup" className="text-gray-muted hover:text-gold transition-colors text-sm">Sign Up</Link></li>
              <li><Link href="/signin" className="text-gray-muted hover:text-gold transition-colors text-sm">Sign In</Link></li>
              <li><Link href="/#pricing" className="text-gray-muted hover:text-gold transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-display text-sm font-semibold text-white tracking-[0.2em] uppercase mb-6">
              Company
            </div>
            <ul className="space-y-3">
              <li><Link href="/#about" className="text-gray-muted hover:text-gold transition-colors text-sm">About</Link></li>
              <li><Link href="mailto:claudio@sor7ed.com" className="text-gray-muted hover:text-gold transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-muted hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-muted hover:text-gold transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-muted hover:text-gold transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2026 SOR7ED. All rights reserved. SOR7ED is not a medical service.{' '}
            <Link 
              href="https://github.com/claudiokurath/sor7ed" 
              target="_blank" 
              rel="noopener"
              className="text-gray-600 hover:text-gold transition-colors"
            >
              GitHub
            </Link>
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-gold transition-colors text-sm">Privacy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gold transition-colors text-sm">Terms</Link>
            <Link href="/cookies" className="text-gray-600 hover:text-gold transition-colors text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
