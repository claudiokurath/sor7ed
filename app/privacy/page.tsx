import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SOR7ED",
  description: "How SOR7ED handles your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative w-full min-h-[40vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/banners/landing%20banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">LEGAL</p>
          <h1 className="font-display font-black uppercase text-white leading-none" style={{fontSize:"clamp(2.5rem,7vw,5.5rem)",letterSpacing:"-0.01em"}}>
            Privacy Policy
          </h1>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-8 text-white/70 text-sm leading-relaxed">
        <p className="text-white/40 font-mono text-xs">Last updated: May 2026</p>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">1. What We Collect</h2>
          <p>We collect your name, email address, WhatsApp number, and usage data (tool completions, saved items) when you sign up. We do not collect payment card details directly — this is handled by Stripe.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">2. How We Use It</h2>
          <p>Your data is used to operate your account, deliver protocols via WhatsApp, and improve the service. We do not sell your data. We do not use it for advertising.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">3. WhatsApp</h2>
          <p>When you use our WhatsApp bot, your phone number and message content are processed to deliver your requested protocol. We store your WhatsApp number in your user profile to enable this service.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">4. Data Storage</h2>
          <p>Your data is stored securely in Supabase (EU region) and Notion (for CRM purposes). We use industry-standard encryption in transit and at rest.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">5. Your Rights</h2>
          <p>Under UK GDPR, you have the right to access, correct, or delete your data at any time. Email hello@sor7ed.com to make a request. We will respond within 30 days.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">6. Cookies</h2>
          <p>We use essential session cookies only. See our <a href="/cookies" className="text-[#00C4C4] hover:underline">Cookie Policy</a> for details.</p>
        </section>
        <section>
          <h2 className="font-display font-black uppercase text-white text-xl mb-3">7. Contact</h2>
          <p>Data controller: SOR7ED Limited, England. Email: <a href="mailto:hello@sor7ed.com" className="text-[#00C4C4] hover:underline">hello@sor7ed.com</a></p>
        </section>
      </div>
    </div>
  );
}
