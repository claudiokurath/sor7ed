import Link from "next/link";
import { branches } from "@/lib/constants";

export default function ExplorePage() {
  return (
    <div className="pt-16">
      <div className="border-b border-border-subtle">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">7 areas of life</p>
          <h1 className="t-display mb-5 text-balance max-w-2xl">
            Everything maps to one of seven areas
          </h1>
          <p className="t-body max-w-xl text-pretty">
            SOR7ED covers the seven areas most affected by executive dysfunction, 
            ADHD, autism, and burnout. Pick yours.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle">
          {branches.map(branch => (
            <Link
              key={branch.slug}
              href={`/${branch.slug}`}
              className="group bg-surface p-8 hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-3xl" aria-hidden="true">
                  {branch.icon || "•"}
                </span>
                <span
                  className="text-ink-disabled group-hover:text-ink group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="t-label text-ink-tertiary mb-2">{branch.num}</p>
              <h2 className="t-title mb-3">{branch.name}</h2>
              <p className="t-body line-clamp-2 text-pretty">
                {branch.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
