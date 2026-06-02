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
    <div className="grid grid-cols-7 gap-3">
      {branches.map((b) => (
        <Link
          key={b.slug}
          href={`/${b.slug}`}
          className="group relative overflow-hidden aspect-square bg-[#0d1619]"
          title={b.name}
        >
          {/* Image */}
          <img
            src={`/Images/branches/${b.slug}.jpg`}
            alt={b.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover overlay with name */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span className="text-white text-xs font-display font-black uppercase leading-tight">
              {b.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
