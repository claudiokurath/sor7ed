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
    <div className="grid grid-cols-7 w-full gap-2" style={{ height: "40vw", maxHeight: "480px", minHeight: "240px" }}>
      {branches.map((b) => (
        <Link
          key={b.slug}
          href={`/${b.slug}`}
          className="group relative overflow-hidden bg-[#0d1619]"
        >
          <img
            src={`/Images/members/${b.slug}.png`}
            alt={b.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      ))}
    </div>
  );
}
