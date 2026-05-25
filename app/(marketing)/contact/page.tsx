import PageBanner from "@/components/PageBanner";

export default function ContactPage() {
  return (
    <>
      <PageBanner src="/Images/banners/landing banner.png" />
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">Contact</p>
          <h1 className="t-display mb-5">
            If something's broken, confusing, or missing — tell us.
          </h1>
          <p className="t-body max-w-lg text-pretty">
            We're a small team. We read everything.
          </p>
        </div>
      </div>

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
