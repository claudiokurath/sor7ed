"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/explore",       label: "Explore"        },
  { href: "/tools",         label: "Tools"          },
  { href: "/intelligence",  label: "Intelligence"   },
  { href: "/#how",          label: "How it works"   },
];

const MOBILE_LINKS = [
  { href: "/",              label: "Home"           },
  { href: "/explore",       label: "7 Branches"     },
  { href: "/tools",         label: "Tools"          },
  { href: "/intelligence",  label: "Articles"       },
  { href: "/signup",        label: "Get started"    },
  { href: "/signup?mode=login", label: "Sign in"    },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (pathname?.startsWith("/statement")) return null;

  return (
    <>
      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        backdropFilter: "blur(14px)",
        background: "color-mix(in srgb,#0a0d0e 70%,transparent)",
        borderBottom: scrolled ? "1px solid #252f33" : "1px solid transparent",
        transition: "border-color .3s",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "16px clamp(20px,5vw,60px)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px",
        }}>
          {/* Wordmark */}
          <Link href="/" style={{
            fontFamily: "'Archivo Expanded','Archivo',sans-serif",
            fontWeight: 900, fontSize: "21px", letterSpacing: ".02em",
            display: "inline-flex", alignItems: "center", color: "#eaf1ee",
            textDecoration: "none",
          }}>
            SOR<span style={{ color: "#2ee6c9" }}>7</span>ED
          </Link>

          {/* Desktop nav links */}
          <nav style={{
            display: "flex", gap: "30px",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "12.5px", letterSpacing: ".05em", textTransform: "uppercase",
          }} className="hp-nav-links-wrap">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: pathname === href ? "#eaf1ee" : "#7d8e8a",
                  transition: "color .2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#eaf1ee")}
                onMouseLeave={(e) => (e.currentTarget.style.color = pathname === href ? "#eaf1ee" : "#7d8e8a")}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* WhatsApp CTA — hidden on mobile */}
            <Link
              href="/signup"
              className="hp-nav-cta-wrap"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "12px", letterSpacing: ".03em", textTransform: "uppercase",
                padding: "10px 18px", borderRadius: "100px",
                background: "#2ee6c9", color: "#04201b", fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: "7px",
                transition: "filter .2s", textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14c-.2.7-1.2 1.3-1.7 1.4-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2 .9.8 1.7 1 2 1.2.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9 1c.3.1.4.2.5.3.1.2.1.7-.2 1.4Z"/>
              </svg>
              Start on WhatsApp
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: "5px", width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ display: "block", height: "1px", background: "#eaf1ee", transition: "all .3s", width: "24px", transform: open ? "rotate(45deg) translateY(6px)" : "none" }} />
              <span style={{ display: "block", height: "1px", background: "#eaf1ee", transition: "all .3s", width: "16px", opacity: open ? 0 : 1 }} />
              <span style={{ display: "block", height: "1px", background: "#eaf1ee", transition: "all .3s", width: "24px", transform: open ? "rotate(-45deg) translateY(-6px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "#0a0d0e",
        display: "flex", flexDirection: "column", justifyContent: "center",
        transition: "opacity .5s, pointer-events .5s",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}>
        <nav style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)", width: "100%" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid #252f33" }}>
            {MOBILE_LINKS.map(({ href, label }) => (
              <li key={href} style={{ borderBottom: "1px solid #252f33" }}>
                <Link
                  href={href}
                  style={{
                    display: "block", padding: "20px 0",
                    fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem,5vw,4rem)",
                    lineHeight: 0.92, letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: pathname === href ? "#2ee6c9" : "#eaf1ee",
                    textDecoration: "none",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#2ee6c9")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = pathname === href ? "#2ee6c9" : "#eaf1ee")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
