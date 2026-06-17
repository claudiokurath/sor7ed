import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | SOR7ED",
  description: "Terms and conditions for using SOR7ED.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative w-full min-h-[40vh] flex items-end overflow-hidden border-b border-[var(--color-line)] bg-gradient-to-b from-[var(--color-surface)] to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-soft),transparent_50%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 w-full">
          <p className="t-label mb-3">LEGAL</p>
          <h1 className="font-display font-black uppercase text-white leading-none" style={{fontSize:"clamp(2.5rem,7vw,5.5rem)",letterSpacing:"-0.01em"}}>
            Terms & Conditions
          </h1>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-8 text-white/70 text-sm leading-relaxed">
        <p className="text-white/40 font-mono text-xs">Last updated: May 2026</p>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">1. Who We Are</h2>
          <p>SOR7ED is operated by SOR7ED Limited (Company No: 16398701), registered in England and Wales. We provide practical tools and protocols for neurodivergent adults, delivered via WhatsApp and our website at sor7ed.com.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">2. Using Our Service</h2>
          <p>By using SOR7ED, you agree to use it for personal, non-commercial purposes only. You must be 18 or over. You must not misuse our WhatsApp bot, attempt to reverse-engineer our systems, or use the service in any unlawful way.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">3. Not Medical Advice</h2>
          <p>SOR7ED is not a medical service, therapy provider, or crisis service. Our tools and protocols are practical life-admin infrastructure only. If you are in crisis, please call 999 or text SHOUT to 85258.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">4. Accounts</h2>
          <p>You are responsible for keeping your account secure. We use magic link authentication — no passwords are stored. We may suspend accounts that violate these terms.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">5. Payments</h2>
          <p>Paid subscriptions are billed monthly or annually. You may cancel at any time. Refunds are handled on a case-by-case basis — contact hello@sor7ed.com.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">6. Intellectual Property</h2>
          <p>All content, tools, and protocols on SOR7ED are owned by SOR7ED Limited. You may not copy, reproduce, or redistribute them without written permission.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">7. Limitation of Liability</h2>
          <p>SOR7ED is provided as-is. We are not liable for any indirect or consequential losses arising from your use of the service.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">8. Contact</h2>
          <p>Questions? Email us at <a href="mailto:hello@sor7ed.com" className="text-[#00C4C4] hover:underline">hello@sor7ed.com</a></p>
        </section>
      </div>
    </div>
  );
}
