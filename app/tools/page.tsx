import { createAdminClient } from "@/lib/supabase/admin";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

export const metadata: Metadata = {
	title: "Tools — SOR7ED",
	description: "High-value audits designed for neurodivergent minds.",
};

export const revalidate = 0;

type ToolCard = {
	slug: string;
	name: string;
	cover_image: string | null;
	short_description: string | null;
	branch: string | null;
};

function isSafeHttpUrl(url: string) {
	try {
		const u = new URL(url);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
}

export default async function ToolsPage() {
	const config = await getSiteConfig();
	const supabase = createAdminClient();

	const { data: tools, error } = await supabase
		.from("tools")
		.select("slug, name, cover_image, short_description, branch, status, featured")
		.eq("status", "Published")
		.order("featured", { ascending: false })
		.order("name", { ascending: true });

	if (error) console.error("[ToolsPage] Failed to load tools:", error);

	const items: ToolCard[] = (tools ?? []).map((t: any) => ({
		slug: t.slug,
		name: t.name,
		cover_image: t.cover_image ?? null,
		short_description: t.short_description ?? null,
		branch: t.branch ?? null,
	}));

	const heroTitle = renderFormattedText(config.tools_hero_title?.text, "white") || "Tools";
	const heroSubtitle = renderFormattedText(config.tools_hero_subtitle?.text, "white") || "Diagnostics and protocols built for neurodivergent brains.";

	return (
		<div className="min-h-screen pb-20">
			<section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
				<div className="absolute inset-0">
					<Image src="/Images/banners/tools%20banner.png" alt="" fill priority sizes="100vw" className="object-cover" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
				</div>
				<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
					<p className="t-label text-white/50 mb-3 font-mono tracking-widest">USE</p>
					<h1 className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}>
						{heroTitle}
					</h1>
					<div className="text-white/60 text-base leading-relaxed max-w-md">
						{heroSubtitle}
					</div>
				</div>
			</section>

			<div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16">
				{items.length === 0 ? (
					<div className="bg-[#0d1619] border border-white/10 p-6">
						<p className="text-white/60 text-sm mb-4">No tools published yet.</p>
						<Link href="/signup" className="btn btn-accent">Get started →</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{items.map((tool) => {
							const cover = tool.cover_image;
							const canShowCover = !!cover && isSafeHttpUrl(cover);
							return (
								<Link key={tool.slug} href={`/tools/${tool.slug}`} className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C4C4]/80" aria-label={`Launch tool: ${tool.name}`}>
									<div>
										<div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
											{canShowCover ? (
												<img src={cover!} alt={tool.name} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" />
											) : (
												<div className="w-full h-full flex items-center justify-center bg-[#131e21]">
													<span className="t-label opacity-30">No Image</span>
												</div>
											)}
										</div>
										<div className="p-5 flex flex-col gap-2">
											<span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{tool.branch ?? "TOOL"}</span>
											<h3 className="text-sm font-bold text-white group-hover:text-[#00C4C4] transition-colors leading-snug">{tool.name}</h3>
											{tool.short_description ? <p className="text-[11px] text-white/60 line-clamp-2 leading-normal">{tool.short_description}</p> : null}
										</div>
									</div>
									<div className="p-5 pt-0 mt-auto">
										<div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest">
											<span className="text-white/30">INTERACTIVE</span>
											<span className="text-[#00C4C4]">LAUNCH TOOL →</span>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
