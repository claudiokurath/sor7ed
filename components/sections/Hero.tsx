import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent animate-pulse-glow" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%)'
        }}
      />

      <div className="container-padding relative z-10 max-w-5xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-px bg-gold opacity-60" />
          <span className="font-display text-xs font-semibold text-gold tracking-[0.35em] uppercase">
            Practical Protocols
          </span>
          <div className="w-8 h-px bg-gold opacity-60" />
        </div>

        <h1 className="font-display font-bold text-7xl md:text-9xl leading-none tracking-tight mb-4">
          <span className="block text-white">GET</span>
          <span className="block text-gradient-gold">SOR7ED</span>
        </h1>

        <p className="font-display text-xl md:text-2xl text-gray-400 tracking-[0.15em] uppercase mb-8">
          Practical protocols for neurodivergent minds
        </p>

        <p className="text-lg md:text-xl text-gray-body max-w-2xl mx-auto leading-relaxed mb-12">
          Seven branches of life. One WhatsApp number. Protocols that actually work 
          for the way your brain is wired — not the way they told you it should work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/signup"
            className="px-8 py-4 bg-gold text-black font-display font-semibold text-sm tracking-[0.1em] uppercase hover:bg-transparent hover:text-gold border-2 border-gold transition-all shadow-lg hover:shadow-gold/25"
          >
            Start Free Today
          </Link>
          <Link 
            href="#how-it-works"
            className="px-8 py-4 bg-transparent text-white font-display font-semibold text-sm tracking-[0.1em] uppercase hover:bg-white hover:text-black border-2 border-white/30 hover:border-white transition-all"
          >
            See How It Works
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-display text-xs text-gray-600 tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
