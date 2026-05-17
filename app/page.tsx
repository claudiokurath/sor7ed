import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Sor7ed</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/assessments" className="hover:text-white transition-colors">
              Assessments
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Interactive assessments with read-aloud technology
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto">
            Master your skills with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              intelligent assessments
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            The premium platform for deep-dive evaluations. Sync with Notion, track progress, 
            and unlock your potential with AI-powered feedback.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/start-assessment" 
              className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-[0_0_40px_-12px_rgba(79,70,229,0.6)] hover:shadow-[0_0_50px_-12px_rgba(79,70,229,0.8)]"
            >
              Start Free Assessment
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-4 rounded-full bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to excel
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Comprehensive assessment tools designed for serious learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900/80">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deep Analytics</h3>
              <p className="text-zinc-400 leading-relaxed">
                Get comprehensive insights into your performance with detailed metrics and personalized improvement recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900/80">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:border-cyan-500/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Notion Sync</h3>
              <p className="text-zinc-400 leading-relaxed">
                Seamlessly integrate with your Notion workspace. Assessment results and study materials sync automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900/80">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Credits</h3>
              <p className="text-zinc-400 leading-relaxed">
                Purchase assessment credits through secure Stripe integration. Use them whenever you're ready to test your skills.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
