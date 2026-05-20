"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/intelligence", label: "Articles" },
  { href: "/explore", label: "7 Areas" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080f11]/95 backdrop-blur-md border-b border-white/8"
            : "bg-transparent"
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-14 border-b border-white/8">
            {/* Wordmark */}
            <Link href="/" className="flex items-center group">
              <span className="font-display text-base font-black tracking-widest text-[#f0ede8] uppercase">
                SOR
              </span>
              <span
                className="font-display text-base font-black tracking-widest text-accent transition-all duration-300 group-hover:opacity-70"
              >
                7
              </span>
              <span className="font-display text-base font-black tracking-widest text-[#f0ede8] uppercase">
                ED
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0 divide-x divide-white/8">
              {NAV_LINKS.map(link => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`t-label px-5 py-5 transition-all duration-150 ${
                      active
                        ? "text-accent"
                        : "text-[rgba(240,237,232,0.38)] hover:text-[#f0ede8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0 divide-x divide-white/8">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex t-label px-5 py-5 text-[rgba(240,237,232,0.38)] hover:text-[#f0ede8] transition-colors"
              >
                Dashboard
              </Link>
              <a
                href="https://wa.me/447591922247?text=HI"
                target="_blank"
                rel="noopener noreferrer"
                className="t-label px-5 py-5 text-accent hover:bg-accent hover:text-[#080f11] transition-all duration-150 flex items-center gap-2"
              >
                Get Started ↗
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden px-4 py-5 text-[rgba(240,237,232,0.38)] hover:text-[#f0ede8] transition-colors"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <div className="flex flex-col gap-[5px] w-4">
                  <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-14 z-40 bg-[#080f11] border-b border-white/8 md:hidden"
          >
            <div className="page-container divide-y divide-white/8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-5 t-label text-[rgba(240,237,232,0.6)] hover:text-[#f0ede8] hover:text-accent transition-colors"
                >
                  {link.label}
                  <span>→</span>
                </Link>
              ))}
              <div className="py-5">
                <a
                  href="https://wa.me/447591922247?text=HI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent w-full justify-center"
                >
                  Text on WhatsApp ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
