export default function ContactPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">CONTACT</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            If something&apos;s broken, confusing, or missing — tell us.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            We&apos;re a small team. We read everything.
          </p>
        </div>
      </section>

      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-subtle max-w-3xl">
          {[
            {
              label: "General enquiries",
              value: "hello@sor7ed.com",
              href: "mailto:hello@sor7ed.com",
              sub: "We aim to reply within 2 business days",
            },
            {
              label: "WhatsApp",
              value: "+44 7591 922247",
              href: "https://wa.me/447591922247",
              sub: "Text HI to get started",
            },
            {
              label: "Press & partnerships",
              value: "hello@sor7ed.com",
              href: "mailto:hello@sor7ed.com?subject=PRESS",
              sub: "Include PRESS in your subject line",
            },
          ].map(item => (
            <div key={item.label} className="bg-surface p-7">
              <p className="t-label mb-3">{item.label}</p>
              <a
                href={item.href}
                className="t-heading text-ink hover:text-accent transition-colors block mb-2"
              >
                {item.value}
              </a>
              <p className="t-small">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
