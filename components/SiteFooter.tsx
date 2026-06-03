import Link from "next/link";

const EXPLORE = [
  { href: "/explore",      label: "The 7 Branches"     },
  { href: "/tools",        label: "Tools"               },
  { href: "/intelligence", label: "Intelligence"        },
  { href: "/#how",         label: "How it works"        },
];

const START = [
  { href: "/signup",       label: "Create free account" },
  { href: "/signup",       label: "Get on WhatsApp"     },
  { href: "/tools",        label: "ADHD Tax Calculator" },
];

const STUDIO = [
  { href: "/about",   label: "About"   },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid #252f33", background: "#0a0d0e" }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        paddingInline: "clamp(20px,5vw,60px)",
        paddingTop: "clamp(44px,6vh,76px)",
        paddingBottom: "clamp(44px,6vh,76px)",
      }}>
        <div
          className="hp-foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "32px",
            paddingBottom: "52px",
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{
              fontFamily: "'Archivo Expanded','Archivo',sans-serif",
              fontWeight: 900, fontSize: "28px", letterSpacing: ".02em",
              display: "inline-flex", alignItems: "center",
              color: "#eaf1ee", textDecoration: "none",
            }}>
              SOR<span style={{ color: "#2ee6c9" }}>7</span>ED
            </Link>
            <p style={{ color: "#7d8e8a", maxWidth: "30ch", fontSize: "14.5px", marginTop: "16px" }}>
              Practical protocols for neurodivergent minds — delivered to your WhatsApp.
              No app, no nonsense.
            </p>
          </div>

          {[
            { heading: "Explore", links: EXPLORE },
            { heading: "Start",   links: START   },
            { heading: "Studio",  links: STUDIO  },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h5 style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase",
                color: "#7d8e8a", marginBottom: "16px",
              }}>{heading}</h5>
              {links.map((l) => (
                <Link key={l.label + l.href} href={l.href} className="hp-footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
          paddingTop: "28px", borderTop: "1px solid #252f33",
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: "11.5px", textTransform: "uppercase", letterSpacing: ".04em",
          color: "#7d8e8a",
        }}>
          <span>© 2026 SOR7ED · Founder-led, privacy-conscious</span>
          <span>Skip the nonsense.</span>
        </div>
      </div>
    </footer>
  );
}
