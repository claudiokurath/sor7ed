import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SOR7ED',
  description: 'How SOR7ED collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors block mb-12">
          ← SOR7ED
        </Link>

        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 font-black">Legal</p>
        <h1 className="text-4xl font-black tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-12">Last updated: May 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-black text-lg mb-3">What we collect</h2>
            <p>When you sign up, we collect your name, email address, and WhatsApp number. When you use our tools, we store your assessment results. We do not collect payment information directly — payments are handled by Stripe.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">How we use your data</h2>
            <p>Your data is used solely to deliver the SOR7ED service: sending protocols to your WhatsApp, personalising your dashboard, and sending optional weekly briefings if you opt in. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">WhatsApp messaging</h2>
            <p>By signing up you consent to receive WhatsApp messages from SOR7ED via the Meta Business API. You can opt out at any time by texting STOP. Opting out stops all non-essential messages immediately.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Data storage</h2>
            <p>Your data is stored in Supabase (EU-North region, hosted on AWS). We use industry-standard encryption in transit and at rest.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Your rights (GDPR)</h2>
            <p>If you are based in the EU or UK, you have the right to access, correct, or delete your personal data at any time. You can delete your account and all associated data from your dashboard Settings tab. For any other requests, email hello@sor7ed.com.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Cookies</h2>
            <p>We use only essential session cookies required for authentication. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Contact</h2>
            <p>Questions about this policy? Email <a href="mailto:hello@sor7ed.com" className="text-white hover:underline">hello@sor7ed.com</a></p>
          </section>

        </div>
      </div>
    </main>
  );
}
