import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SOR7ED',
  description: 'Terms and conditions for using SOR7ED.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors block mb-12">
          ← SOR7ED
        </Link>

        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 font-black">Legal</p>
        <h1 className="text-4xl font-black tracking-tight mb-3">Terms of Service</h1>
        <p className="text-white/30 text-sm mb-12">Last updated: May 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-black text-lg mb-3">The service</h2>
            <p>SOR7ED provides assessment tools and protocol content delivered via WhatsApp. By creating an account you agree to these terms.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Account</h2>
            <p>You are responsible for keeping your login credentials secure. You must be 16 or older to use SOR7ED. One account per person.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Protocols are not medical advice</h2>
            <p>SOR7ED protocols are educational tools and practical frameworks, not medical advice, diagnosis, or treatment. If you are in crisis, contact a medical professional or emergency service. In the UK: Samaritans 116 123. Crisis text line: text HELLO to 85258.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Acceptable use</h2>
            <p>You agree not to misuse the service, attempt to extract content programmatically, or share account access with others.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Cancellation</h2>
            <p>You can delete your account at any time from your dashboard Settings tab. All your data is removed immediately and permanently.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Changes to these terms</h2>
            <p>We may update these terms. We will notify you via email if there are material changes. Continued use after notification constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Contact</h2>
            <p>Questions? Email <a href="mailto:hello@sor7ed.com" className="text-white hover:underline">hello@sor7ed.com</a></p>
          </section>

        </div>
      </div>
    </main>
  );
}
