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
    <div className="grid grid-cols-7 w-full gap-[3px]" style={{ height: "40vw", maxHeight: "480px", minHeight: "240px" }}>
      {branches.map((b) => (
        <Link
          key={b.slug}
          href={`/${b.slug}`}
          className="tile group"
          title={b.name}
        >
          <img
            src={`/Images/members/${b.slug}.png`}
            alt={b.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gold gradient overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(0deg, rgba(212,175,55,0.4) 0%, transparent 50%)" }}
          />
        </Link>
      ))}
    </div>
  );
}
