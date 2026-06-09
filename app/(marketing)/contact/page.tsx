import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | SOR7ED",
  description: "Get in touch with SOR7ED.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative w-full min-h-[40vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing%20banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 w-full">
          <p className="t-label mb-3">CONTACT</p>
          <h1 className="font-display font-black uppercase text-white leading-none" style={{fontSize:"clamp(2.5rem,7vw,5.5rem)",letterSpacing:"-0.01em"}}>
            Get in Touch
          </h1>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-8">
        <p className="text-white/70 text-base leading-relaxed">
          We&apos;d love to hear from you. Whether you have a question about the tools, your account, or just want to say hello — reach out.
        </p>
        <div className="space-y-4">
          <div className="border border-[#2e2a22] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Email</p>
            <a href="mailto:hello@sor7ed.com" className="text-[#00C4C4] text-lg font-display font-black uppercase hover:underline">
              hello@sor7ed.com
            </a>
          </div>
          <div className="border border-[#2e2a22] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">WhatsApp</p>
            <a href="https://wa.me/447591922247" target="_blank" rel="noopener noreferrer" className="text-[#00C4C4] text-lg font-display font-black uppercase hover:underline">
              Message us on WhatsApp
            </a>
          </div>
          <div className="border border-[#2e2a22] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Company</p>
            <p className="text-white/70 text-sm">SOR7ED Limited<br/>Company No: 16398701<br/>Registered in England & Wales</p>
          </div>
        </div>
      </div>
    </div>
  );
}
