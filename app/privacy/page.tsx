export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            How we collect, use, and protect your data. Last updated: May 2026.
          </p>
        </div>
      </section>

      <div className="page-container py-16">
        <div className="max-w-3xl prose prose-neutral">
          <h2 className="t-title mb-4">1. Information We Collect</h2>
          <p className="t-body mb-6 text-pretty">
            We collect the information you provide to us directly, such as your phone number when you connect via WhatsApp, and the data you submit through our platform to deliver our tools and protocols.
          </p>

          <h2 className="t-title mb-4">2. How We Use Your Data</h2>
          <p className="t-body mb-6 text-pretty">
            Your data is primarily used to provide you with SOR7ED protocols and keep track of your saved tools. We never sell your personal information to third parties.
          </p>

          <h2 className="t-title mb-4">3. Data Retention and Deletion</h2>
          <p className="t-body mb-6 text-pretty">
            You can request to delete your account and all associated data at any time by contacting us. We will securely erase your information from our active databases.
          </p>

          <p className="t-small mt-12 text-ink-tertiary">
            This is a summary. For full legal details, please contact us at hello@sor7ed.com.
          </p>
        </div>
      </div>
    </>
  );
}
