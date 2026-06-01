import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About | SOR7ED",
	description: "SOR7ED is practical infrastructure for neurodivergent adults — scaffolding, not motivation.",
};

const PROBLEM_POINTS = [
	"Start on demand",
	"Remember steps without prompting",
	"Tolerate complex apps",
	"Stay consistently motivated",
] as const;

const HOW_IT_WORKS = [
	{ title: "Read", body: "Short, ND-aware posts that don't assume infinite willpower." },
	{ title: "Text", body: "Send a keyword on WhatsApp. No apps to learn." },
	{ title: "Use", body: "Get a usable template/tool you can run immediately." },
] as const;

export default function AboutPage() {
	return (
		<>
			<header className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src="/Images/banners/landing banner.png"
						alt="SOR7ED abstract banner background"
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
				</div>
				<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
					<p className="t-label text-white/50 mb-3 font-mono tracking-widest">ABOUT</p>
					<h1 className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}>
						We exist for the 1 in 5.
					</h1>
					<p className="text-white/70 text-base leading-relaxed max-w-xl">
						Because neurodivergent adults deserve tools built for how their brain actually works — not how productivity culture thinks it should.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link href="/signup" className="btn btn-accent">Get started →</Link>
						<Link href="/signup?mode=login" className="btn btn-ghost">I already have an account</Link>
					</div>
				</div>
			</header>

			<section className="border-b border-border-subtle">
				<div className="page-container py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
					<div>
						<p className="t-label text-accent mb-4">The problem</p>
						<h2 className="t-title mb-5">Mainstream productivity assumes the wrong brain.</h2>
						<ul className="space-y-3" aria-label="Common expectations that don't match real life">
							{PROBLEM_POINTS.map((item) => (
								<li key={item} className="flex items-start gap-3">
									<span className="text-ink-disabled mt-0.5" aria-hidden="true">✗</span>
									<p className="t-body">{item}</p>
								</li>
							))}
						</ul>
					</div>
					<div>
						<p className="t-label text-accent mb-4">Our answer</p>
						<h2 className="t-title mb-5">Scaffolding, not motivation.</h2>
						<p className="t-body text-pretty mb-4">
							SOR7ED is a content and tools platform for neurodivergent adults: ADHD, autism, AuDHD, dyslexia, RSD, burnout-prone, and overwhelmed-by-life-admin humans.
						</p>
						<p className="t-body text-pretty">
							You read a post. You text a keyword. You get a usable tool — delivered straight to WhatsApp.
						</p>
						<div className="mt-6">
							<p className="t-label text-ink-tertiary mb-2">Built for</p>
							<div className="flex flex-wrap gap-2">
								{["Low-friction", "Shame-free", "ND-aware", "WhatsApp-first", "Template-led"].map((tag) => (
									<span key={tag} className="badge">{tag}</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-border-subtle bg-surface-subtle">
				<div className="page-container py-16">
					<p className="t-label text-ink-tertiary mb-4">How it works</p>
					<h2 className="t-title mb-8">A loop you can actually complete.</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{HOW_IT_WORKS.map((step) => (
							<div key={step.title} className="card p-6">
								<p className="t-label text-accent mb-2">{step.title}</p>
								<p className="t-body">{step.body}</p>
							</div>
						))}
					</div>
					<div className="mt-10 flex flex-wrap items-center gap-3">
						<Link href="/signup" className="btn btn-accent">Start free →</Link>
						<p className="t-small text-ink-tertiary">No complicated setup. No "productivity personality" required.</p>
					</div>
				</div>
			</section>

			<section className="border-b border-border-subtle" aria-label="Important disclaimer">
				<div className="page-container py-10">
					<div className="max-w-2xl">
						<p className="t-label text-ink-tertiary mb-3">Important</p>
						<p className="t-body">
							SOR7ED is <strong className="text-ink font-semibold">not</strong> therapy, medical advice, or a crisis service. It is practical infrastructure for life admin. If you are in crisis, call 999 or text SHOUT to 85258.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
