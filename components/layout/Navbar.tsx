"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-60 flex items-center justify-between px-[var(--pad)] py-5"
        style={{ zIndex: 60 }}
      >
        <Link href="/" aria-label="SOR7ED home" className="flex items-center">
          <Image src="/Images/Logo2026.png" alt="SOR7ED" height={34} width={80} style={{ height: 34, width: "auto" }} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/explore", label: "Explore" },
            { href: "/tools", label: "Tools" },
            { href: "/articles", label: "Articles" },
            { href: "/signup", label: "Get Started" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: label === "Get Started" ? "#d4af37" : "rgba(241,236,225,0.65)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="block w-6 h-px bg-[#f1ece1] transition-all" style={{ transform: open ? "rotate(45deg) translate(4px,4px)" : "" }} />
          <span className="block w-6 h-px bg-[#f1ece1] transition-all" style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-6 h-px bg-[#f1ece1] transition-all" style={{ transform: open ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
        </button>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center gap-8 bg-[#09090b]" style={{ paddingTop: 80 }}>
          {[
            { href: "/explore", label: "Explore" },
            { href: "/tools", label: "Tools" },
            { href: "/articles", label: "Articles" },
            { href: "/signup", label: "Get Started" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-display font-bold uppercase text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: label === "Get Started" ? "#d4af37" : "#f1ece1" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
