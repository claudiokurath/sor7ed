export default function TermsOfServicePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">LEGAL</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            Terms of Service
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            The rules and guidelines for using SOR7ED. Last updated: May 2026.
          </p>
        </div>
      </section>

      <div className="page-container py-16">
        <div className="max-w-3xl prose prose-neutral">
          <h2 className="t-title mb-4">1. Acceptance of Terms</h2>
          <p className="t-body mb-6 text-pretty">
            By accessing or using SOR7ED, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="t-title mb-4">2. Medical Disclaimer</h2>
          <p className="t-body mb-6 text-pretty">
            <strong className="text-ink">SOR7ED is not a medical or therapy service.</strong> The content provided is for informational and organizational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>

          <h2 className="t-title mb-4">3. WhatsApp Integration</h2>
          <p className="t-body mb-6 text-pretty">
            By initiating contact with our WhatsApp bot, you consent to receiving messages from us via the WhatsApp platform. Standard messaging rates may apply depending on your carrier.
          </p>

          <p className="t-small mt-12 text-ink-tertiary">
            This is a summary. For full legal details, please contact us at hello@sor7ed.com.
          </p>
        </div>
      </div>
    </>
  );
}
