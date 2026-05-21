import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

export const metadata: Metadata = {
  title: "Tools — SOR7ED",
  description: "High-value audits designed for neurodivergent minds.",
};

export const revalidate = 60;

export default async function ToolsPage() {
  const config = await getSiteConfig();
  const supabase = await createClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, cover_image, short_description, branch")
    .neq("status", "Draft")
    .order("featured", { ascending: false });

  const items = tools ?? [];

  const pageBg = config.tools_bg_color?.color || '#080f11';
  const pageAccent = config.tools_accent_color?.color || '#E8453C';

  const localStyle = {
    backgroundColor: pageBg,
    '--color-surface': pageBg,
    '--color-coral': pageAccent,
    '--color-coral-dim': pageAccent + '1a',
    '--color-coral-border': pageAccent + '40',
  } as React.CSSProperties;

  return (
    <div style={localStyle} className="min-h-screen pt-24 pb-20 relative overflow-hidden transition-colors duration-500">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-coral/4 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/3 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="t-label text-coral mb-3 font-mono tracking-widest">USE</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)", letterSpacing: "-0.01em" }}
          >
            {renderFormattedText(config.tools_hero_title?.text, 'var(--color-coral)')}
          </h1>
          <div className="text-white/60 text-base leading-relaxed">
            {renderFormattedText(config.tools_hero_subtitle?.text, 'var(--color-coral)')}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-coral/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image container: aspect-video (16:9) to fit landscape tool images perfectly */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                  {tool.cover_image ? (
                    <img
                      src={tool.cover_image}
                      alt={tool.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#131e21]">
                      <span className="t-label opacity-30">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Text box */}
                <div className="p-5 flex flex-col gap-2">
                  <span className="tag bg-black/40 border-coral/20 text-coral text-[9px] px-1.5 py-0.5 self-start">{tool.branch}</span>
                  <h3 className="t-heading text-sm font-bold text-white group-hover:text-coral transition-colors leading-snug line-clamp-2 uppercase">
                    {tool.name}
                  </h3>
                  {tool.short_description && (
                    <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">
                      {tool.short_description}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="p-5 pt-0 mt-auto">
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest text-coral">
                  <span className="text-white/40 font-mono font-normal">INTERACTIVE</span>
                  <span>LAUNCH TOOL →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-white/40 text-sm">No tools published yet.</p>
        )}
      </div>
    </div>
  );
}
