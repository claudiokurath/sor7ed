// app/page.tsx — SOR7ED Homepage v3
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

// === DATA CONSTANTS ===
const STATS = {
  templateDownloads: 12847,
  toolCompletions: 3892,
  averageRating: 4.8,
  branches: 7
};

const TOOLS_FALLBACK = [
  {
    id: "adhd-tax-calculator",
    name: "ADHD Tax Calculator",
    time: "3 min",
    desc: "Interactive calculator. Finds your exact annual ADHD tax with personalized reduction strategies.",
    completions: 1247,
    price: "£7"
  },
  {
    id: "time-blindness-check",
    name: "Time Blindness Check",
    time: "2 min",
    desc: "Diagnostic assessment. Discovers your Time Distortion Factor and builds custom calendar protocols.",
    completions: 3892,
    price: "£7"
  },
  {
    id: "executive-function-audit",
    name: "Executive Function Audit",
    time: "5 min",
    desc: "Full cognitive profile. Identifies your specific EF gaps and generates targeted interventions.",
    completions: 876,
    price: "£12"
  }
];

const TEMPLATES = [
  {
    id: "adhd-tax-tracker",
    name: "ADHD Tax Tracker",
    desc: "Spreadsheet template to track what ADHD costs you monthly.",
    format: "WhatsApp + Sheets"
  },
  {
    id: "time-blindness-log",
    name: "Time Blindness Log",
    desc: "Simple log to spot your personal time distortion patterns.",
    format: "WhatsApp + PDF"
  },
  {
    id: "dopamine-menu",
    name: "Dopamine Menu",
    desc: "Pre-built menu of quick wins for low-energy days.",
    format: "WhatsApp + Notion"
  }
];

const BRANCHES = ['Cognitive', 'Temporal', 'Emotional', 'Financial', 'Social', 'Physical', 'Environmental'];

const FAQS = [
  {
    q: "What's the difference between templates and tools?",
    a: "Templates are static files (spreadsheets, PDFs, checklists) sent to your WhatsApp — free forever, no account needed. Tools are interactive assessments that diagnose your specific situation and generate personalized protocols — these require an account and payment."
  },
  {
    q: "Do I need an account for templates?",
    a: "No. Text SORTED to +44 7400 123456 and templates arrive instantly. No signup, no password, no friction."
  },
  {
    q: "Why do tools cost money?",
    a: "Tools use custom algorithms to analyze your inputs and build personalized protocols. They require ongoing development, hosting, and support. Templates are simpler to maintain, so we keep them free."
  },
  {
    q: "Can I try a tool before buying?",
    a: "Yes. Every tool has a free preview showing exactly what you'll get. You see the full report structure before you pay."
  },
  {
    q: "Is this a substitute for therapy?",
    a: "Absolutely not. We provide organizational tools and frameworks. For medical or psychological advice, always consult a professional."
  }
];

// === WHATSAPP CONFIG ===
const WHATSAPP_NUMBER = "+44 7400 123456"; // UPDATE THIS
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=SORTED`;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: dbTools } = await supabase
    .from('tools')
    .select('*')
    .neq('status', 'Draft')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: articles } = await supabase
    .from('protocols')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .limit(3);

  const tools = (dbTools && dbTools.length > 0) ? dbTools : TOOLS_FALLBACK;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* === NAVIGATION === */}
      <nav className="fixed top-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SOR<span className="text-yellow-400">7</span>ED
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-sm text-white/60">
            <Link href="/templates" className="hover:text-white transition">Templates</Link>
            <Link href="/tools" className="hover:text-white transition">Tools</Link>
            <Link href="/archive" className="hover:text-white transition">Archive</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="hidden sm:block text-white/60 hover:text-white text-sm transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block text-white/60 hover:text-white text-sm transition"
              >
                Log in
              </Link>
            )}
            <Link
              href="/signup"
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-2 flex justify-around text-xs text-white/60">
            <Link href="/templates" className="hover:text-white py-2">Templates</Link>
            <Link href="/tools" className="hover:text-white py-2">Tools</Link>
            <Link href="/archive" className="hover:text-white py-2">Archive</Link>
            <Link href="/about" className="hover:text-white py-2">About</Link>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="pt-36 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-white/70 text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Practical protocols via WhatsApp
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            A shame-free platform built for{" "}
            <span className="text-yellow-400">neurodivergent</span>{" "}
            and busy minds
          </h1>

          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
            Free templates on WhatsApp. Premium tools when you're ready.
            Built by someone who gets it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-300 transition inline-flex items-center justify-center gap-2"
            >
              Get Free Templates
              <span>→</span>
            </a>
            <Link
              href="#tools"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition inline-flex items-center justify-center"
            >
              Explore Tools
            </Link>
          </div>

          <p className="text-sm text-white/40 mt-4">
            Text <span className="text-yellow-400 font-mono">SORTED</span> to{" "}
            <a href={WHATSAPP_LINK} className="text-white/60 hover:text-white underline">
              {WHATSAPP_NUMBER}
            </a>
            {" "}— free forever, no account.
          </p>
        </div>
      </section>

      {/* === SOCIAL PROOF === */}
      <section className="py-12 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400">{STATS.templateDownloads.toLocaleString()}</div>
            <div className="text-sm text-white/50">Templates sent</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{STATS.branches}</div>
            <div className="text-sm text-white/50">Life branches</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{STATS.averageRating}/5</div>
            <div className="text-sm text-white/50">Average rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{STATS.toolCompletions.toLocaleString()}</div>
            <div className="text-sm text-white/50">Tools completed</div>
          </div>
        </div>
      </section>

      {/* === 7 BRANCHES === */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Every part of your life, simplified</h2>
          <p className="text-white/50 mb-12">7 branches. 50+ protocols. One WhatsApp.</p>

          <div className="flex flex-wrap justify-center gap-3">
            {BRANCHES.map((branch) => (
              <span
                key={branch}
                className="border border-white/20 rounded-full px-5 py-2 text-sm text-white/80 hover:border-yellow-400 hover:text-yellow-400 transition cursor-default"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* === FREE TEMPLATES === */}
      <section className="py-20 px-4 bg-yellow-400/5 border-y border-yellow-400/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400/20 text-yellow-400 text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Free Forever
            </span>
            <h2 className="text-3xl font-bold mb-2">Templates</h2>
            <p className="text-white/50">Instant. No account. Straight to your WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <a
                key={template.id}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 rounded-xl p-6 hover:border-yellow-400/50 hover:bg-white/5 transition block"
              >
                <div className="flex justify-between text-xs text-white/40 mb-4 uppercase tracking-wider">
                  <span>Template</span>
                  <span className="text-yellow-400">Free</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{template.desc}</p>
                <span className="text-xs text-white/30">{template.format}</span>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-yellow-400 hover:underline"
            >
              Text SORTED to {WHATSAPP_NUMBER}
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* === PREMIUM TOOLS === */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-white/70 text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Premium
            </span>
            <h2 className="text-3xl font-bold mb-2">Tools</h2>
            <p className="text-white/50">Interactive assessments. Personalized protocols. Account required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool: any) => (
              <div
                key={tool.id}
                className="border border-white/10 rounded-xl p-6 hover:border-white/30 hover:bg-white/5 transition relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                  {tool.price}
                </div>
                <div className="flex justify-between text-xs text-white/40 mb-4 uppercase tracking-wider">
                  <span>Tool</span>
                  <span>⏱ {tool.time}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">{tool.desc ?? tool.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">
                    {tool.completions?.toLocaleString()} completed
                  </span>
                  <Link
                    href="/signup?redirect=/tools"
                    className="text-white/80 text-sm font-medium hover:text-white transition"
                  >
                    Create account →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 border border-white/10 rounded-xl bg-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-semibold mb-1">Want all tools?</h3>
                <p className="text-white/50 text-sm">Monthly subscription coming soon. Get early access.</p>
              </div>
              <Link
                href="/waitlist"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition whitespace-nowrap"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Get free templates",
                desc: `Text SORTED to ${WHATSAPP_NUMBER}. Instant templates, no account, no catch.`
              },
              {
                step: "02",
                title: "Hit a wall?",
                desc: "When templates aren't enough, our interactive tools diagnose your specific friction points."
              },
              {
                step: "03",
                title: "Create account",
                desc: "One account unlocks all tools, saves your results, and builds your personal protocol library."
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-yellow-400/20 mb-4">{item.step}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIAL === */}
      {/* TODO: Replace with real user testimonial before launch */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-xl md:text-2xl italic text-white/90 mb-6 leading-relaxed">
            "I started with the free templates. Two weeks later I bought the Tax Calculator
            and finally understood where my money was going. Worth every penny."
          </blockquote>
          <footer className="text-white/50">
            <span className="text-white font-medium">James R.</span>
            <span className="mx-2">·</span>
            <span>ADHD, software developer</span>
          </footer>
          <p className="text-xs text-white/20 mt-4">* Replace with real testimonial before launch</p>
        </div>
      </section>

      {/* === PRICING === */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Simple pricing</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-yellow-400/30 rounded-xl p-8 bg-yellow-400/5">
              <div className="text-sm text-yellow-400 uppercase tracking-wider mb-2">Free Forever</div>
              <h3 className="text-xl font-bold mb-4">Templates</h3>
              <ul className="text-left text-white/60 text-sm space-y-3 mb-6">
                <li>✓ Instant WhatsApp delivery</li>
                <li>✓ No account required</li>
                <li>✓ New templates weekly</li>
                <li>✓ Community access</li>
              </ul>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition text-center"
              >
                Get Templates
              </a>
            </div>

            <div className="border border-white/10 rounded-xl p-8">
              <div className="text-sm text-white/50 uppercase tracking-wider mb-2">Premium</div>
              <h3 className="text-xl font-bold mb-4">Tools</h3>
              <ul className="text-left text-white/60 text-sm space-y-3 mb-6">
                <li>✓ Interactive assessments</li>
                <li>✓ Personalized protocols</li>
                <li>✓ Save results & track progress</li>
                <li>✓ Priority WhatsApp support</li>
              </ul>
              <div className="text-center text-white/40 text-sm mb-4">
                From £7 per tool
              </div>
              <Link
                href="/signup"
                className="block w-full border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/5 transition text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Frequent questions</h2>

          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-white/10 pb-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === WHATSAPP CTA === */}
      <section className="py-20 px-4 bg-yellow-400/5 border-y border-yellow-400/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get sorted today</h2>
          <p className="text-white/50 mb-8">
            Free templates on WhatsApp. No credit card. No waiting.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-400 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message {WHATSAPP_NUMBER}
          </a>

          <p className="text-xs text-white/30 mt-4">
            Or text <span className="text-yellow-400 font-mono">SORTED</span> to the number above
          </p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-sm">
            © 2026 SOR7ED. Built for neurodivergent minds.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/templates" className="text-white/60 hover:text-white transition">Templates</Link>
            <Link href="/tools" className="text-white/60 hover:text-white transition">Tools</Link>
            <Link href="/about" className="text-white/60 hover:text-white transition">About</Link>
            <Link href="/privacy" className="text-white/60 hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
