"use client";
import Link from "next/link";

type Branch = {
  slug: string;
  name: string;
  cover_image: string;
  description: string;
};

export default function BranchesGrid({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid grid-cols-7 w-full" style={{ height: "40vw", maxHeight: "480px", minHeight: "240px" }}>
      {branches.map((b) => (
        <Link
          key={b.slug}
          href={`/${b.slug}`}
          className="group relative overflow-hidden bg-[#0d1619]"
          title={b.name}
        >
          {/* Background image */}
          <img
            src={`/Images/members/${b.slug}.png`}
            alt={b.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          {/* Branch name always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className="text-white font-display font-black uppercase text-sm leading-tight block">
              {b.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
