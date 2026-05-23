"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "7 Branches" },
  { href: "/intelligence", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/archive", label: "Archive" },
  { href: "/auth/login", label: "Login" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-[#080f11]/98 backdrop-blur-md border-b border-white/8" : "bg-transparent"
      }`}>
        <div className="page-container lg:max-w-none lg:px-[6%] xl:px-[10%]">
          <div className="flex items-center justify-between h-14">

            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-0 group" aria-label="SOR7ED home">
              <span className="font-display text-xl tracking-widest text-[#f0ede8] uppercase">SOR</span>
              <span className="font-display text-xl tracking-widest text-[#00C4C4] uppercase">7</span>
              <span className="font-display text-xl tracking-widest text-[#f0ede8] uppercase">ED</span>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex flex-col justify-center items-end gap-[5px] w-11 h-11 group"
            >
              <span className={`block h-px bg-[#f0ede8] transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-[6px]" : "w-6"}`} />
              <span className={`block h-px bg-[#f0ede8] transition-all duration-300 ${open ? "opacity-0 w-4" : "w-4"}`} />
              <span className={`block h-px bg-[#f0ede8] transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-[6px]" : "w-6"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div className={`fixed inset-0 z-40 bg-[#080f11] flex flex-col justify-center transition-all duration-500 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <nav className="page-container">
          <ul className="flex flex-col gap-0 divide-y divide-white/8">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-5 t-display transition-colors duration-200 ${
                    pathname === href ? "text-[#00C4C4]" : "text-[#f0ede8] hover:text-[#00C4C4]"
                  }`}
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
