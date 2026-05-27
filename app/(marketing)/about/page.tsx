export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">ABOUT</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            We exist for the 1 in 5.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            Because neurodivergent adults deserve tools built for how their brain actually works — not how productivity gurus think it should.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <div className="border-b border-border-subtle">
        <div className="page-container py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="t-label text-accent mb-4">The problem</p>
            <h2 className="t-title mb-5">
              Mainstream productivity assumes the wrong brain.
            </h2>
            <div className="space-y-3">
              {[
                "Start on demand",
                "Remember steps without prompting",
                "Tolerate complex apps",
                "Stay consistently motivated",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-ink-disabled mt-0.5" aria-hidden="true">✗</span>
                  <p className="t-body">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="t-label text-accent mb-4">Our answer</p>
            <h2 className="t-title mb-5">Scaffolding, not motivation.</h2>
            <p className="t-body text-pretty mb-4">
              SOR7ED is a content and tools platform for neurodivergent adults:
              ADHD, autism, AuDHD, dyslexia, RSD, burnout-prone, and
              overwhelmed-by-life-admin humans.
            </p>
            <p className="t-body text-pretty">
              You read a post. You text a keyword. You get a usable tool —
              delivered straight to WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="border-b border-border-subtle bg-surface-subtle">
        <div className="page-container py-10">
          <div className="max-w-2xl">
            <p className="t-label text-ink-tertiary mb-3">Important</p>
            <p className="t-body">
              SOR7ED is <strong className="text-ink font-semibold">not</strong> therapy,
              medical advice, or a crisis service. It is practical infrastructure
              for life admin. If you are in crisis, call 999 or text SHOUT to 85258.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
