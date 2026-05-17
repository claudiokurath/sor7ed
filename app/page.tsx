import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b-2 border-white bg-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="display-md">SOR7ED</div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/assessments" className="label hover:text-[#FFD107] transition-colors">
              ASSESSMENTS
            </Link>
            <Link href="/pricing" className="label hover:text-[#FFD107] transition-colors">
              PRICING
            </Link>
            <Link href="/login" className="btn-outline">
              SIGN IN
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto stagger">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#FFD107] bg-black mb-8 animate-pulse-yellow">
            <span className="flex h-2 w-2 bg-[#FFD107]"></span>
            <span className="label-yellow">INTERACTIVE READ-ALOUD TECHNOLOGY</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="display-xl mb-6 max-w-5xl">
            MASTER YOUR SKILLS WITH{' '}
            <span className="text-[#FFD107]">INTELLIGENT ASSESSMENTS</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg text-white/70 max-w-2xl mb-12 font-body leading-relaxed">
            Deep-dive evaluations with read-aloud technology, instant Notion sync, 
            and credit-based flexibility. Built for people who take growth seriously.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-20">
            <Link href="/start-assessment" className="btn-yellow">
              START FREE ASSESSMENT
            </Link>
            <Link href="/demo" className="btn-outline">
              VIEW DEMO
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-0 border-2 border-white max-w-2xl">
            <div className="p-6 border-r-2 border-white text-center">
              <p className="display-lg text-[#FFD107]">500+</p>
              <p className="label mt-2">QUESTIONS</p>
            </div>
            <div className="p-6 border-r-2 border-white text-center">
              <p className="display-lg text-[#FFD107]">12</p>
              <p className="label mt-2">SUBJECTS</p>
            </div>
            <div className="p-6 text-center">
              <p className="display-lg text-[#FFD107]">98%</p>
              <p className="label mt-2">ACCURACY</p>
            </div>
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section className="py-24 px-6 border-t-2 border-white">
        <div className="max-w-7xl mx-auto stagger">
          <div className="mb-16">
            <p className="label-yellow mb-4">PROCESS</p>
            <h2 className="display-lg mb-4 max-w-xl">
              THREE STEPS TO CLARITY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-white">
            <div className="card-interactive p-8 border-r-2 border-white">
              <p className="display-xl text-[#FFD107] mb-6">01</p>
              <h3 className="display-sm mb-3">CHOOSE</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Select your subject and difficulty level. From quick 10-minute 
                checks to comprehensive deep-dive sessions.
              </p>
            </div>

            <div className="card-interactive p-8 border-r-2 border-white">
              <p className="display-xl text-[#FFD107] mb-6">02</p>
              <h3 className="display-sm mb-3">ASSESS</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Answer questions with optional read-aloud support. 
                No time pressure - just honest, thorough evaluation.
              </p>
            </div>

            <div className="card-interactive p-8">
              <p className="display-xl text-[#FFD107] mb-6">03</p>
              <h3 className="display-sm mb-3">IMPROVE</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Get instant results synced to your Notion workspace. 
                See exactly where to focus your efforts next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t-2 border-white">
        <div className="max-w-7xl mx-auto stagger">
          <div className="mb-16">
            <p className="label-yellow mb-4">FEATURES</p>
            <h2 className="display-lg mb-4">
              EVERYTHING BUILT IN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-interactive p-8">
              <h3 className="display-sm mb-3 text-[#FFD107]">READ-ALOUD TECHNOLOGY</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Every question can be read aloud so you can focus entirely on thinking, 
                not reading. Perfect for accessibility and deep concentration.
              </p>
            </div>

            <div className="card-interactive p-8">
              <h3 className="display-sm mb-3 text-[#FFD107]">NOTION SYNC</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Results automatically sync to your Notion database after every session. 
                No exports, no manual copying - just seamless integration.
              </p>
            </div>

            <div className="card-interactive p-8">
              <h3 className="display-sm mb-3 text-[#FFD107]">DEEP-DIVE ASSESSMENTS</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Go beyond surface knowledge with comprehensive evaluations 
                that reveal real understanding and identify specific gaps.
              </p>
            </div>

            <div className="card-interactive p-8">
              <h3 className="display-sm mb-3 text-[#FFD107]">CREDIT-BASED SYSTEM</h3>
              <p className="text-white/70 font-body leading-relaxed">
                Buy assessment credits through Stripe integration. 
                No subscriptions - use them on your schedule when you're ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t-2 border-white bg-[#FFD107]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="display-lg text-black mb-6">
            STOP GUESSING. START KNOWING.
          </h2>
          <p className="text-lg text-black/70 mb-12 font-body max-w-2xl mx-auto">
            Join professionals who use Sor7ed to identify knowledge gaps 
            and accelerate their learning with precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/start-assessment" 
              className="btn bg-black text-white border-2 border-black hover:bg-white hover:text-black px-8 py-4"
            >
              START FIRST ASSESSMENT
            </Link>
            <Link 
              href="/pricing" 
              className="btn bg-transparent text-black border-2 border-black hover:bg-black hover:text-white px-8 py-4"
            >
              VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t-2 border-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="display-md">SOR7ED</span>
          <div className="flex flex-wrap gap-8">
            <Link href="/privacy" className="label hover:text-[#FFD107] transition-colors">
              PRIVACY
            </Link>
            <Link href="/terms" className="label hover:text-[#FFD107] transition-colors">
              TERMS
            </Link>
            <Link href="/contact" className="label hover:text-[#FFD107] transition-colors">
              CONTACT
            </Link>
          </div>
          <p className="label">© 2024 SOR7ED. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
