import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools — SOR7ED",
  description: "High-value audits designed for neurodivergent minds.",
};

export const revalidate = 60;

export default async function ToolsPage() {
  const supabase = await createClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, cover_image, short_description, branch")
    .neq("status", "Draft")
    .order("featured", { ascending: false });

  const items = tools ?? [];

  return (
    <div className="min-h-screen bg-black pt-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16">

        {/* Title */}
        <h1
          className="font-display font-black uppercase text-white leading-none mb-6"
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)", letterSpacing: "-0.03em" }}
        >
          Tools
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-base max-w-xl leading-relaxed mb-14">
          High-value audits designed for neurodivergent minds. Complete the assessment to unlock your personalised protocol on WhatsApp.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-3">
                {tool.cover_image ? (
                  <img
                    src={tool.cover_image}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>
              <p className="text-white text-sm font-medium leading-tight group-hover:text-[#2dd4bf] transition-colors">
                {tool.name}
              </p>
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
