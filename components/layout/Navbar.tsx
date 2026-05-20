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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-0.5 group">
              <span className="font-display text-lg font-medium tracking-tight text-ink">
                SOR
              </span>
              <span
                className="font-display text-lg font-medium tracking-tight text-accent transition-all duration-300 group-hover:scale-110"
                style={{ filter: "drop-shadow(0 0 8px rgba(234, 179, 8, 0.3))" }}
              >
                7
              </span>
              <span className="font-display text-lg font-medium tracking-tight text-ink">
                ED
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`t-label px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "text-ink bg-surface-raised"
                        : "text-ink-tertiary hover:text-ink hover:bg-surface-subtle"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex t-small text-ink-secondary hover:text-ink transition-colors"
              >
                Dashboard
              </Link>
              <a
                href="https://wa.me/447591922247?text=HI"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm"
              >
                <span className="text-sm" aria-hidden="true">💬</span>
                Get Started
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-subtle transition-colors"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <div className="flex flex-col gap-1 w-4">
                  <span
                    className={`block h-0.5 bg-ink transition-all duration-300 ${
                      menuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-ink transition-all duration-300 ${
                      menuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-ink transition-all duration-300 ${
                      menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-lg md:hidden"
          >
            <div className="page-container py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-subtle transition-colors"
                >
                  <span className="t-heading">{link.label}</span>
                  <span className="text-ink-disabled">→</span>
                </Link>
              ))}
              <hr className="my-3 border-border-subtle" />
              <a
                href="https://wa.me/447591922247?text=HI"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent w-full justify-center"
              >
                <span aria-hidden="true">💬</span>
                Text us on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
