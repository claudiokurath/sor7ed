"use client";
import Link from "next/link";

export default function HeroSlideshow() {
  return (
    <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      <img
        src="/Images/home/hero.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-24 w-full">
        <h1
          className="font-display font-black uppercase text-white leading-none mb-6 max-w-3xl"
          style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)", letterSpacing: "-0.03em" }}
        >
          Skip the nonsense
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools" className="btn btn-accent">Browse Tools →</Link>
          <Link href="/articles" className="btn btn-ghost">Read Articles</Link>
        </div>
      </div>
    </section>
  );
}
