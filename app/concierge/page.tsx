import Link from "next/link";
import Image from "next/image";
import { siteConfig, branches } from "@/lib/constants";

export const metadata = {
  title: "Concierge | SOR7ED",
  description: "Bespoke WhatsApp-delivered protocols built around your specific situation.",
};

export default function ConciergePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <div className="px-5 pt-8 pb-0 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 opacity-25 hover:opacity-60 transition-opacity">
          <span className="text-white text-sm">←</span>
          <Image src="/Images/Logo2026.png" alt="SOR7ED" width={60} height={24} className="h-5 w-auto" />
        </Link>
        <Link href="/signup" className="text-white/30 text-[10px] tracking-widest uppercase font-medium hover:text-white transition-colors">
          Sign In
        </Link>
      </div>

      {/* Hero */}
      <section className="px-5 pt-20 pb-16 max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-5 font-black">
            SOR7ED Concierge
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.92] mb-6">
            Your protocol,<br />built for you.
          </h1>
          <p className="text-white/50 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
            Take an assessment, get a personalised protocol delivered straight to your WhatsApp. No generic advice — something that actually fits your brain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-8 py-5 rounded-full font-black text-black bg-white hover:scale-105 transition-all duration-300 text-base"
            >
              Start an Assessment →
            </Link>
            <Link
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              className="inline-flex items-center justify-center px-8 py-5 rounded-full font-black text-white/70 border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300 text-base"
            >
              Message us on WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* How it works */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-10 font-black">How It Works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              num: "01",
              title: "Take an Assessment",
              desc: "Pick a branch, answer 5 questions. Takes under 2 minutes.",
            },
            {
              num: "02",
              title: "Get Your Keyword",
              desc: "We generate a personalised keyword based on your results.",
            },
            {
              num: "03",
              title: "Text It to WhatsApp",
              desc: "Send the keyword and receive your full step-by-step protocol instantly.",
            },
          ].map(step => (
            <div key={step.num} className="bg-white/[0.03] border border-white/5 rounded-2xl p-7">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">{step.num}</p>
              <h3 className="text-lg font-black text-white mb-2 tracking-tight">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Branches */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-3 font-black">Choose Your Branch</p>
        <p className="text-white/40 text-base mb-10 max-w-lg">
          Each branch targets a specific area of life. Start with the one causing the most friction right now.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map(branch => (
            <Link
              key={branch.slug}
              href={`/tools`}
              className="group flex items-start gap-4 bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300"
            >
              <span className="text-2xl shrink-0">{branch.icon}</span>
              <div>
                <h3 className="font-black text-base mb-1 tracking-tight" style={{ color: branch.color }}>
                  {branch.name}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed">{branch.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Bottom CTA */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-4 font-black">Ready?</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Two minutes. Real protocols.
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto mb-8">
            No account required to start. Pick your branch and take the assessment.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center px-10 py-5 rounded-full font-black text-black bg-white hover:scale-105 transition-all duration-300 text-base"
          >
            Explore Assessments →
          </Link>
        </div>
      </section>

    </main>
  );
}
