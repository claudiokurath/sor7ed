import PageBanner from "@/components/PageBanner";

export default function AboutPage() {
  return (
    <>
      <PageBanner src="/Images/banners/landing banner.png" />
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-24">
          <div className="max-w-2xl">
            <p className="t-label text-accent mb-4">About</p>
            <h1 className="t-display mb-6 text-balance">
              We exist for the 1 in 5.
            </h1>
            <p className="t-body text-lg text-pretty">
              Because neurodivergent adults deserve tools built for how their
              brain actually works — not how productivity gurus think it should.
            </p>
          </div>
        </div>
      </div>

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
