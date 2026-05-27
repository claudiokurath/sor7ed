import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | SOR7ED',
  description: 'How SOR7ED uses cookies — we only use essential session cookies required for authentication.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
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
            Cookie Policy
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            We only use essential session cookies required for authentication. Last updated: May 2026.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors block mb-12">
          ← SOR7ED
        </Link>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-black text-lg mb-3">The short version</h2>
            <p>SOR7ED uses only essential session cookies required for authentication. We do not use advertising cookies, tracking cookies, or any third-party analytics cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">What we use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-6 text-white/40 font-semibold text-xs uppercase tracking-wider">Cookie</th>
                    <th className="text-left py-3 pr-6 text-white/40 font-semibold text-xs uppercase tracking-wider">Purpose</th>
                    <th className="text-left py-3 text-white/40 font-semibold text-xs uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-6 font-mono text-xs text-white/70">sb-*</td>
                    <td className="py-3 pr-6">Supabase authentication session</td>
                    <td className="py-3">1 week</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 font-mono text-xs text-white/70">sb-auth-token</td>
                    <td className="py-3 pr-6">Keeps you logged in between visits</td>
                    <td className="py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">What we do not use</h2>
            <p>We do not use Google Analytics, Meta Pixel, advertising networks, retargeting cookies, or any other third-party tracking. Your browsing on SOR7ED is not tracked beyond what is necessary to keep you signed in.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3">Managing cookies</h2>
            <p>Because we only use strictly necessary cookies, there is nothing optional to opt out of. If you sign out or delete your account, all session cookies are cleared immediately. You can also clear cookies at any time through your browser settings — you will simply be signed out.</p>
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
