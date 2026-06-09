"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/tools", label: "Tools" },
    { href: "/articles", label: "Intelligence" },
    { href: "/#how-it-works", label: "How it works" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--pad)] py-4 transition-all duration-200 ${
          scrolled
            ? "bg-[var(--color-ink)]/85 backdrop-blur-md border-b border-[var(--color-line)]"
            : "bg-transparent"
        }`}
      >
        <Link href="/" aria-label="SOR7ED home" className="flex items-center">
          <span className="font-sans font-black text-2xl tracking-[0.02em] text-[var(--color-bone)] uppercase">
            SOR<span className="text-[var(--color-accent)]">7</span>ED
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-muted)] hover:text-[var(--color-bone)] transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started."
            className="btn btn-primary"
            style={{ padding: "10px 20px" }}
          >
            Start on WhatsApp <span className="arrow">→</span>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="block w-6 h-px bg-[var(--color-bone)] transition-all" style={{ transform: open ? "rotate(45deg) translate(4px,4px)" : "" }} />
          <span className="block w-6 h-px bg-[var(--color-bone)] transition-all" style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-6 h-px bg-[var(--color-bone)] transition-all" style={{ transform: open ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
        </button>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 bg-[var(--color-ink)]" style={{ paddingTop: 80 }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-display font-bold uppercase text-3xl tracking-tight text-[var(--color-bone)]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started."
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4"
          >
            Start on WhatsApp <span className="arrow">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
