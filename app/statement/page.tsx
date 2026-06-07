"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function StatementPage() {
  useEffect(() => {
    // Scroll reveal animation
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Progress rail
    const rail = document.getElementById("rail");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (rail) {
        rail.style.width = (p * 100).toFixed(2) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 600;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 600;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 600;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 700;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 700;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 700;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 800;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 800;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 800;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 900;
  font-stretch: 100%;
  font-display: swap;
  src: url("a2a4e7c1-6dfc-4b93-b710-bc2503a5f7ff") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 900;
  font-stretch: 100%;
  font-display: swap;
  src: url("621b835f-4dff-4a5b-849d-7f40da658db0") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 900;
  font-stretch: 100%;
  font-display: swap;
  src: url("e2fc3247-a4ee-48f7-89f4-035ece6b6236") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("54aa571d-c1d8-45d8-9fd1-3350575818c1") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("6fe5f37d-80c7-4ef2-874e-aa53d7bc9522") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("cb937d8a-1425-414d-99a3-a8a51654a7ef") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("7a5f13c2-8940-49f9-b1e5-f834f8820018") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("024d8107-5b41-4fdd-9c26-877368cf6cee") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("5a99955e-0c6c-4f06-a58d-3e7551ad72e9") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("54aa571d-c1d8-45d8-9fd1-3350575818c1") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("6fe5f37d-80c7-4ef2-874e-aa53d7bc9522") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("cb937d8a-1425-414d-99a3-a8a51654a7ef") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("7a5f13c2-8940-49f9-b1e5-f834f8820018") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("024d8107-5b41-4fdd-9c26-877368cf6cee") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("5a99955e-0c6c-4f06-a58d-3e7551ad72e9") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("54aa571d-c1d8-45d8-9fd1-3350575818c1") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("6fe5f37d-80c7-4ef2-874e-aa53d7bc9522") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("cb937d8a-1425-414d-99a3-a8a51654a7ef") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("7a5f13c2-8940-49f9-b1e5-f834f8820018") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("024d8107-5b41-4fdd-9c26-877368cf6cee") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("5a99955e-0c6c-4f06-a58d-3e7551ad72e9") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


  :root {
    --ink: #09090b;
    --ink-2: #0c0b08;
    --surface: #15110b;
    --line: #2e2a22;
    --line-soft: #1c1913;
    --bone: #f1ece1;
    --muted: #8c8473;
    --accent: #d4af37;
    --accent-ink: #1c1505;
    --warn: #f0c44b;
    --display: "Archivo Expanded", "Archivo", sans-serif;
    --sans: "Archivo", sans-serif;
    --mono: "JetBrains Mono", monospace;
    --maxw: 1320px;
    --pad: clamp(22px, 5vw, 76px);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--ink);
    color: var(--bone);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    overflow-x: hidden;
  }
  ::selection { background: var(--accent); color: var(--accent-ink); }
  a { color: inherit; text-decoration: none; }
  .wrap { max-width: var(--maxw); margin: 0 auto; padding-inline: var(--pad); }

  .mono { font-family: var(--mono); }
  .accent { color: var(--accent); }
  .warn { color: var(--warn); }

  /* film-grain / vignette ambience */
  body::before {
    content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(120% 80% at 80% -10%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 55%),
      radial-gradient(90% 70% at -10% 110%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 55%);
  }
  main { position: relative; z-index: 1; }

  /* ---------- LABEL ROW ---------- */
  .label {
    font-family: var(--mono); font-size: 12px; letter-spacing: .22em; text-transform: uppercase;
    color: var(--accent); display: inline-flex; align-items: center; gap: 12px; white-space: nowrap;
  }
  .label::before { content: ""; width: 8px; height: 8px; background: var(--accent); flex: none; }
  .idx { font-family: var(--mono); font-size: 12px; letter-spacing: .2em; color: var(--muted); text-transform: uppercase; }

  /* ---------- FIXED CHROME ---------- */
  .topbar {
    position: fixed; inset: 0 0 auto 0; z-index: 60;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px var(--pad);
  }
  .brand-logo { display: inline-flex; align-items: center; }
  .brand-logo img { height: 34px; width: auto; display: block; }
  .wordmark { font-family: var(--display); font-weight: 900; font-size: 19px; letter-spacing: .04em; color: #fff; }
  .topbar .pageno { font-family: var(--mono); font-size: 11.5px; letter-spacing: .2em; color: var(--bone); text-transform: uppercase; }

  /* progress rail */
  .rail { position: fixed; left: 0; top: 0; height: 2px; width: 0%; background: var(--accent); z-index: 70; transition: width .1s linear; }

  /* ---------- GENERIC PANEL ---------- */
  .panel { position: relative; padding-block: clamp(96px, 17vh, 200px); border-top: 1px solid var(--line-soft); }
  .panel:first-of-type { border-top: 0; }
  .panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; margin-bottom: clamp(34px, 5vh, 64px); flex-wrap: wrap; }

  /* big display type */
  .statement {
    font-family: var(--display); font-weight: 700;
    line-height: 0.94; letter-spacing: -0.03em;
    font-size: clamp(38px, 8.2vw, 132px);
    text-wrap: balance;
  }
  .statement .em { color: var(--accent); }
  .statement .strike { color: var(--muted); position: relative; white-space: nowrap; }
  .statement .strike::after {
    content: ""; position: absolute; left: -2%; right: -2%; top: 52%; height: clamp(4px, 0.7vw, 10px);
    background: var(--warn); transform: scaleX(0); transform-origin: left; transition: transform .8s cubic-bezier(.2,.7,.2,1) .25s;
  }
  .reveal.in .statement .strike::after { transform: scaleX(1); }

  .sub {
    margin-top: clamp(26px, 3.4vh, 44px); max-width: 60ch;
    font-size: clamp(17px, 1.55vw, 22px); color: color-mix(in srgb, var(--bone) 80%, transparent);
  }
  .sub b { color: var(--bone); font-weight: 600; }

  /* ---------- HERO ---------- */
  .hero { min-height: 100svh; display: flex; flex-direction: column; justify-content: center; padding-top: 96px; padding-bottom: clamp(40px, 7vh, 90px); border-top: 0; position: relative; overflow: hidden; }
  .hero-media { position: absolute; inset: 0; z-index: 0; }
  .hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: 64% 30%; opacity: .82; transform: scale(1.04); filter: contrast(1.16) saturate(1.12) brightness(1.04); }
  .hero-media .scrim { position: absolute; inset: 0; background:
      linear-gradient(90deg, var(--ink) 4%, color-mix(in srgb, var(--ink) 62%, transparent) 42%, color-mix(in srgb, var(--ink) 14%, transparent) 72%, transparent),
      linear-gradient(0deg, var(--ink), color-mix(in srgb, var(--ink) 24%, transparent) 44%, transparent 72%); }
  .hero > .wrap { position: relative; z-index: 1; }
  .hero .kicker { display: flex; align-items: center; gap: 16px; margin-bottom: clamp(28px, 4vh, 48px); flex-wrap: wrap; }
  .hero .kicker .pill { font-family: var(--mono); font-size: 11.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); padding: 7px 13px; }
  .hero h1 {
    font-family: var(--display); font-weight: 800;
    font-size: clamp(46px, 10.4vw, 178px); line-height: 0.9; letter-spacing: -0.035em;
    text-wrap: balance;
  }
  .hero h1 .l2 { color: var(--muted); }
  .hero h1 .l2 .fix { color: var(--accent); }
  .hero .scrollcue { margin-top: clamp(40px, 7vh, 90px); display: flex; align-items: center; gap: 14px; font-family: var(--mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .hero .scrollcue .ln { width: 60px; height: 1px; background: var(--muted); position: relative; overflow: hidden; }
  .hero .scrollcue .ln::after { content: ""; position: absolute; inset: 0; width: 40%; background: var(--accent); animation: slide 1.8s cubic-bezier(.5,0,.5,1) infinite; }
  @keyframes slide { 0% { transform: translateX(-100%);} 100% { transform: translateX(250%);} }

  /* ---------- INSTEAD (yes list) ---------- */
  .yes-block { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(28px, 5vw, 80px); align-items: start; }
  .yes-list { display: flex; flex-direction: column; }
  .yes {
    display: flex; gap: 20px; padding: clamp(20px, 2.2vw, 30px) 0; border-top: 1px solid var(--line);
  }
  .yes:first-child { border-top: 0; }
  .yes .n { font-family: var(--mono); font-size: 13px; color: var(--accent); padding-top: 6px; flex: none; width: 34px; }
  .yes .body h4 { font-family: var(--display); font-weight: 700; font-size: clamp(20px, 2.2vw, 30px); letter-spacing: -0.015em; margin-bottom: 8px; }
  .yes .body p { color: var(--muted); font-size: clamp(14.5px, 1.1vw, 16.5px); max-width: 44ch; }

  /* ---------- BIG SKIP MOMENT ---------- */
  .skip-panel { text-align: center; padding-block: clamp(120px, 24vh, 280px); }
  .skip-panel .big {
    font-family: var(--display); font-weight: 900; letter-spacing: -0.045em; line-height: 0.82;
    font-size: clamp(56px, 19vw, 320px); text-transform: uppercase;
  }
  .skip-panel .big .o { color: var(--ink); -webkit-text-stroke: clamp(1.5px,0.28vw,4px) var(--accent); }
  .skip-panel .tail { margin-top: clamp(26px, 4vh, 48px); font-family: var(--mono); font-size: clamp(12px, 1.1vw, 15px); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }

  /* ---------- SEVEN BRANCHES ---------- */
  .seven-head { display: flex; align-items: center; gap: clamp(20px, 3vw, 44px); margin-bottom: clamp(28px, 4vh, 52px); flex-wrap: wrap; }
  .seven-num { font-family: var(--display); font-weight: 900; font-size: clamp(110px, 18vw, 230px); line-height: 0.74; color: var(--accent); letter-spacing: -0.04em; }
  .seven-head .st { font-family: var(--display); font-weight: 700; font-size: clamp(28px, 4.4vw, 64px); line-height: 0.96; letter-spacing: -0.025em; }
  .seven-head .st .em { color: var(--accent); }
  .tile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(10px, 1.2vw, 16px); }
  .tile {
    position: relative; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid var(--line);
    background: var(--surface); display: block;
  }
  .tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: contrast(1.12) saturate(1.08); transition: transform .6s cubic-bezier(.2,.7,.2,1), opacity .3s; }
  .tile::before { content: ""; position: absolute; inset: 0; z-index: 1; background: color-mix(in srgb, var(--ink) 8%, transparent); transition: background .3s; }
  .tile .tcap {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
    display: flex; align-items: flex-end; gap: 12px; padding: 16px clamp(14px, 1.6vw, 22px) clamp(13px, 1.5vw, 18px);
    background: linear-gradient(0deg, color-mix(in srgb, var(--ink) 92%, transparent) 8%, color-mix(in srgb, var(--ink) 60%, transparent) 55%, transparent);
  }
  .tile .tcap .tn { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: .1em; color: var(--accent); flex: none; line-height: 1.5; }
  .tile .tcap .td { font-family: var(--sans); font-weight: 500; font-size: clamp(13px, 1.05vw, 15.5px); line-height: 1.3; color: color-mix(in srgb, var(--bone) 88%, transparent); text-wrap: balance; }
  .tile .bn { position: absolute; top: 10px; left: 10px; z-index: 2; font-family: var(--mono); font-size: 11px; letter-spacing: .12em; color: var(--bone); background: color-mix(in srgb, var(--ink) 62%, transparent); backdrop-filter: blur(4px); border: 1px solid color-mix(in srgb, var(--bone) 18%, transparent); padding: 3px 8px; }
  .tile:hover { border-color: var(--accent); }
  .tile:hover img { transform: scale(1.07); }
  .tile:hover::before { background: color-mix(in srgb, var(--ink) 4%, transparent); }
  .tile.more {
    display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: clamp(18px, 2vw, 26px);
    background: #000; border-color: var(--accent); color: var(--bone);
  }
  .tile.more::before { display: none; }
  .tile.more .ml { font-family: var(--mono); font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; opacity: .65; }
  .tile.more .mt { font-family: var(--display); font-weight: 800; font-size: clamp(18px, 2vw, 26px); letter-spacing: -0.015em; line-height: 1; color: var(--bone); }
  .tile.more .mgo { margin-top: auto; font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; color: var(--accent); }

  /* ---------- TOOLS PREVIEW ---------- */
  .tool-feature { display: grid; grid-template-columns: 1.05fr 0.95fr; border: 1px solid var(--line); }
  .tool-media { position: relative; overflow: hidden; min-height: 320px; }
  .tool-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .86; filter: contrast(1.14) saturate(1.1); }
  .tool-media .tscrim { position: absolute; inset: 0; background: linear-gradient(120deg, color-mix(in srgb, var(--ink) 30%, transparent), color-mix(in srgb, var(--ink) 8%, transparent)); }
  .tool-media .flag { position: absolute; top: 18px; left: 18px; z-index: 2; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-ink); background: var(--accent); padding: 6px 11px; white-space: nowrap; }
  .tool-copy { padding: clamp(28px, 3.4vw, 52px); display: flex; flex-direction: column; }
  .tool-copy h3 { font-family: var(--display); font-weight: 800; font-size: clamp(28px, 3.6vw, 52px); line-height: 0.96; letter-spacing: -0.025em; margin-bottom: 16px; }
  .tool-copy h3 .em { color: var(--accent); }
  .tool-copy p { color: var(--muted); font-size: clamp(15px, 1.1vw, 17px); max-width: 46ch; margin-bottom: 26px; }
  .tool-copy .leak { font-family: var(--mono); font-size: clamp(34px, 4.4vw, 60px); font-weight: 700; color: var(--warn); letter-spacing: -0.02em; line-height: 1; margin-bottom: 6px; }
  .tool-copy .leak-sub { font-family: var(--mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: auto; }
  .tool-copy .tool-cta { margin-top: 30px; }
  .tool-more { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(10px, 1.2vw, 16px); margin-top: clamp(14px, 1.6vw, 18px); }
  .tool-mini { border: 1px solid var(--line); padding: clamp(18px, 1.8vw, 24px); transition: border-color .25s; display: flex; flex-direction: column; gap: 8px; }
  .tool-mini:hover { border-color: var(--accent); }
  .tool-mini .mtag { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); }
  .tool-mini .mname { font-family: var(--display); font-weight: 700; font-size: clamp(17px, 1.5vw, 22px); letter-spacing: -0.01em; }
  .tool-mini .mdesc { color: var(--muted); font-size: 13.5px; }

  /* ---------- ARTICLES PREVIEW ---------- */
  .art-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid var(--line); }
  .art-card { border-left: 1px solid var(--line); display: flex; flex-direction: column; transition: background .25s; }
  .art-card:first-child { border-left: 0; }
  .art-card:hover { background: var(--ink-2); }
  .art-card .amedia { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--surface); }
  .art-card .amedia img { width: 100%; height: 100%; object-fit: cover; transition: transform .55s cubic-bezier(.2,.7,.2,1); }
  .art-card .amedia::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, var(--ink) 2%, transparent 50%); }
  .art-card:hover .amedia img { transform: scale(1.05); }
  .art-card .abody { padding: clamp(22px, 2.4vw, 32px); display: flex; flex-direction: column; flex: 1; }
  .art-card .tag { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  .art-card h3 { font-family: var(--display); font-weight: 700; font-size: clamp(21px, 2vw, 30px); line-height: 1.02; letter-spacing: -0.02em; margin: 0 0 12px; }
  .art-card p { color: var(--muted); font-size: clamp(14px, 1vw, 15.5px); margin-bottom: 22px; }
  .art-card .rd { margin-top: auto; font-family: var(--mono); font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: var(--bone); display: inline-flex; align-items: center; gap: 8px; transition: gap .25s, color .25s; }
  .art-card:hover .rd { color: var(--accent); gap: 12px; }

  /* ---------- CLOSER / CTA ---------- */
  .closer { min-height: 96svh; display: flex; flex-direction: column; justify-content: center; text-align: left; position: relative; overflow: hidden; }
  .closer-media { position: absolute; inset: 0; z-index: 0; }
  .closer-media img { width: 100%; height: 100%; object-fit: cover; object-position: 66% center; opacity: .48; filter: contrast(1.16) saturate(1.12) brightness(1.04); }
  .closer-media .scrim { position: absolute; inset: 0; background:
      linear-gradient(90deg, var(--ink) 10%, color-mix(in srgb, var(--ink) 68%, transparent) 60%, color-mix(in srgb, var(--ink) 42%, transparent)),
      linear-gradient(0deg, var(--ink), transparent 60%); }
  .closer > .wrap { position: relative; z-index: 1; }
  .closer h2 {
    font-family: var(--display); font-weight: 800;
    font-size: clamp(44px, 9.6vw, 158px); line-height: 0.9; letter-spacing: -0.035em; text-wrap: balance;
  }
  .closer h2 .accent { color: var(--accent); }
  .closer .actions { margin-top: clamp(36px, 5.5vh, 64px); display: flex; gap: 14px; flex-wrap: wrap; }
  .btn {
    font-family: var(--mono); font-size: 13px; letter-spacing: .04em; text-transform: uppercase;
    padding: 17px 26px; border: 1px solid var(--line); display: inline-flex; align-items: center; gap: 11px;
    cursor: pointer; transition: all .2s; background: transparent; color: var(--bone);
  }
  .btn .arrow { transition: transform .25s; }
  .btn:hover .arrow { transform: translateX(5px); }
  .btn-primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 700; }
  .btn-primary:hover { filter: brightness(1.08); }
  .btn-ghost:hover { border-color: var(--bone); }
  .btn svg { width: 17px; height: 17px; }
  .closer .micro { margin-top: 26px; font-family: var(--mono); font-size: 12px; letter-spacing: .04em; color: var(--muted); line-height: 1.8; }

  footer { border-top: 1px solid var(--line); padding-block: 30px; }
  .foot-in { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-family: var(--mono); font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }

  /* ---------- REVEAL ---------- */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
  .reveal.in { opacity: 1; transform: none; }
  .reveal.d1 { transition-delay: .08s; } .reveal.d2 { transition-delay: .16s; } .reveal.d3 { transition-delay: .24s; }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    .statement .strike::after { transform: scaleX(1); transition: none; }
    .hero .scrollcue .ln::after { animation: none; }
  }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 880px) {
    .yes-block { grid-template-columns: 1fr; gap: 32px; }
    .tile-grid { grid-template-columns: repeat(2, 1fr); }
    .tool-feature { grid-template-columns: 1fr; }
    .tool-media { min-height: 220px; }
    .tool-more { grid-template-columns: 1fr; }
    .art-grid { grid-template-columns: 1fr; }
    .art-card { border-left: 0; border-top: 1px solid var(--line); min-height: 0; }
    .art-card:first-child { border-top: 0; }
  }
  @media (max-width: 480px) {
    .tile-grid { grid-template-columns: 1fr; }
    .seven-num { font-size: clamp(90px, 26vw, 140px); }
  }
` }} />
      
      {/* Progress rail */}
      <div className="rail" id="rail" />

      {/* Top Header */}
      <header className="topbar">
        <Link className="brand-logo" href="https://sor7ed.com" aria-label="SOR7ED home">
          <img src="/Images/statement/ef90b96a-f218-4709-af99-8c8926dbc6f5.png" alt="SOR7ED" style={{ height: "34px" }} />
        </Link>
        <span className="pageno mono">THE STATEMENT — 2026</span>
      </header>

      <main id="top">

  
  <section className="panel hero" data-screen-label="Hero">
    <div className="hero-media" aria-hidden="true">
      <img src="dff4fdaa-5a30-4b0f-89d9-b12f2706c3a8" alt="" />
      <div className="scrim"></div>
    </div>
    <div className="wrap reveal">
      <div className="kicker">
        <span className="label">A manifesto</span>
        <span className="pill">For neurodivergent adults</span>
      </div>
      <h1>
        Your brain<br />
        isn't broken.<br />
        <span className="l2">The advice <span className="fix">was.</span></span>
      </h1>
      <div className="scrollcue">
        <span className="ln"></span>
        Scroll to read
      </div>
    </div>
  </section>

  
  <section className="panel" data-screen-label="Statement 01">
    <div className="wrap">
      <div className="panel-head reveal">
        <span className="label">The problem</span>
        <span className="idx">01 / 06</span>
      </div>
      <p className="statement reveal d1">
        Most productivity advice was built for brains that
        <span className="strike">already work the "normal" way.</span>
      </p>
      <p className="sub reveal d2">
        Color-coded planners. Five-a.m. routines. Apps that need their own onboarding before they help you do anything. <b>For a lot of us, that's not a system — it's another thing to fail at.</b>
      </p>
    </div>
  </section>

  
  <section className="panel skip-panel" data-screen-label="Skip the nonsense">
    <div className="wrap reveal">
      <div className="big">SKIP&nbsp;THE<br /><span className="o">NONSENSE</span></div>
      <div className="tail">— the only rule we kept</div>
    </div>
  </section>

  
  <section className="panel" data-screen-label="Statement 03">
    <div className="wrap">
      <div className="panel-head reveal">
        <span className="label">What we do instead</span>
        <span className="idx">02 / 06</span>
      </div>
      <div className="yes-block">
        <p className="statement reveal d1" style={{"fontSize":"clamp(34px,5.8vw,92px)"}}>
          One next step. Sent to a place you <span className="em">already check.</span>
        </p>
        <div className="yes-list reveal d2">
          <div className="yes">
            <span className="n">01</span>
            <div className="body">
              <h4>It lives in WhatsApp</h4>
              <p>No new login, no home-screen guilt. Support shows up in the chat app you open forty times a day already.</p>
            </div>
          </div>
          <div className="yes">
            <span className="n">02</span>
            <div className="body">
              <h4>Protocols, not lectures</h4>
              <p>Short, do-able steps for money, planning, burnout and the rest — written to be followed on a low-capacity day.</p>
            </div>
          </div>
          <div className="yes">
            <span className="n">03</span>
            <div className="body">
              <h4>Start with one thing</h4>
              <p>Pick the area that's loudest right now. No giant life-overhaul required to get a single useful win.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="panel" data-screen-label="Seven branches">
    <div className="wrap">
      <div className="panel-head reveal">
        <span className="label">The map</span>
        <span className="idx">03 / 06</span>
      </div>
      <div className="seven-head reveal">
        <span className="seven-num">7</span>
        <span className="st">branches.<br />One <span className="em">message</span> away.</span>
      </div>
      <div className="tile-grid reveal d1">
        <Link className="tile" href="https://wa.me/447591922247?text=KEEP%20GOING" data-link="keep-going"><img src="17bbe76b-46ee-456b-8f88-cf8a83ebfec2" alt="Keep Going" /><span className="tcap"><span className="tn">01</span><span className="td">Career, learning, momentum &amp; skill-building</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=FEEL%20GOOD" data-link="feel-good"><img src="1c6987d8-d1f7-464a-af55-6f8f6d2f17e6" alt="Feel Good" /><span className="tcap"><span className="tn">02</span><span className="td">Health, energy, sleep &amp; sensory needs</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=SPEND%20SMART" data-link="spend-smart"><img src="765cbcc6-f92c-4841-a68e-514dd1a9a632" alt="Spend Smart" /><span className="tcap"><span className="tn">03</span><span className="td">Money, bills, budgeting &amp; impulse spending</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=BE%20CONNECTED" data-link="be-connected"><img src="aad3fb46-b342-4b81-973b-34eb0626d7b2" alt="Be Connected" /><span className="tcap"><span className="tn">04</span><span className="td">Relationships, communication &amp; boundaries</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=PLAN%20AHEAD" data-link="plan-ahead"><img src="f69e667b-b24a-4edb-97c5-5e9a4d751f19" alt="Plan Ahead" /><span className="tcap"><span className="tn">05</span><span className="td">Planning, executive function &amp; systems</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=BE%20YOURSELF" data-link="be-yourself"><img src="6b49e618-35cf-4180-9e15-425f29fad4a1" alt="Be Yourself" /><span className="tcap"><span className="tn">06</span><span className="td">Identity, unmasking, shame &amp; regulation</span></span></Link>
        <Link className="tile" href="https://wa.me/447591922247?text=LEVEL%20UP" data-link="level-up"><img src="9d7b949a-47ee-4b1f-b52b-8a18f936a46e" alt="Level Up" /><span className="tcap"><span className="tn">07</span><span className="td">Digital tools, automation &amp; productivity</span></span></Link>
        <Link className="tile more" href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started." data-link="whatsapp">
          <span className="ml">Start anywhere</span>
          <span className="mt">Pick the one that's loudest.</span>
          <span className="mgo">On WhatsApp <span className="arrow">→</span></span>
        </Link>
      </div>
    </div>
  </section>

  
  <section className="panel" data-screen-label="Tools">
    <div className="wrap">
      <div className="panel-head reveal">
        <span className="label">The tools</span>
        <span className="idx">04 / 06</span>
      </div>
      <p className="statement reveal d1" style={{"fontSize":"clamp(30px,5vw,76px)","marginBottom":"clamp(34px,5vh,56px)"}}>
        Start with something you can use <span className="em">today.</span>
      </p>
      <div className="tool-feature reveal d2">
        <div className="tool-media">
          <span className="flag">★ Flagship tool</span>
          <img src="c7444fe8-0492-48fb-87f8-50b46dcabd70" alt="" />
          <div className="tscrim"></div>
        </div>
        <div className="tool-copy">
          <h3>The ADHD Tax <span className="em">Calculator</span></h3>
          <p>See what ADHD-related habits may be costing you each year — late fees, impulse buys, lost items, forgotten subscriptions.</p>
          <div className="leak">£1,200+</div>
          <div className="leak-sub">typical hidden cost / year</div>
          <div className="tool-cta">
            <Link href="https://sor7ed.com" data-link="tool-adhd-tax" className="btn btn-primary">Get the full breakdown <span className="arrow">→</span></Link>
          </div>
        </div>
      </div>
      <div className="tool-more reveal d3">
        <Link className="tool-mini" href="https://sor7ed.com" data-link="tool-decision"><span className="mtag">Plan Ahead</span><span className="mname">Decision Paralysis Solver</span><span className="mdesc">Stuck choosing? Answer four questions and get one clear next move.</span></Link>
        <Link className="tool-mini" href="https://sor7ed.com" data-link="tool-autopilot"><span className="mtag">Spend Smart</span><span className="mname">Financial Autopilot</span><span className="mdesc">Set money admin to run itself so bills stop slipping through.</span></Link>
        <Link className="tool-mini" href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started." data-link="whatsapp"><span className="mtag">Be Yourself</span><span className="mname">Meltdown First Aid</span><span className="mdesc">A short protocol for the moments your system tips over.</span></Link>
      </div>
    </div>
  </section>

  
  <section className="panel" data-screen-label="Articles">
    <div className="wrap">
      <div className="panel-head reveal">
        <span className="label">Intelligence</span>
        <span className="idx">05 / 06</span>
      </div>
      <p className="statement reveal d1" style={{"fontSize":"clamp(30px,5vw,76px)","marginBottom":"clamp(20px,3vh,30px)"}}>
        Articles that explain what's <span className="em">actually happening.</span>
      </p>
      <p className="sub reveal d1" style={{"marginTop":"0","marginBottom":"clamp(34px,5vh,52px)"}}>We unpack the patterns behind burnout, loneliness, people-pleasing and money stress — <b>practical insight, not fluff.</b></p>
      <div className="art-grid reveal d2">
        <article className="art-card">
          <div className="amedia"><img src="0895132f-ba40-4449-ba6a-4a8b1c2225b5" alt="" /></div>
          <div className="abody">
            <span className="tag">Feel Good</span>
            <h3>The burnout loop nobody warned you about</h3>
            <p>Why ND burnout isn't laziness — and the recovery protocol that doesn't rely on willpower.</p>
            <span className="rd">Read article <span className="arrow">→</span></span>
          </div>
        </article>
        <article className="art-card">
          <div className="amedia"><img src="53fc9e6b-9be1-4431-9755-9084543474da" alt="" /></div>
          <div className="abody">
            <span className="tag">Be Connected</span>
            <h3>People-pleasing is a nervous system, not a personality</h3>
            <p>Scripts and boundaries for when “no” feels physically impossible.</p>
            <span className="rd">Read article <span className="arrow">→</span></span>
          </div>
        </article>
        <article className="art-card">
          <div className="amedia"><img src="6ab6db7d-41f3-4b8d-b192-6dd0cfe81806" alt="" /></div>
          <div className="abody">
            <span className="tag">Spend Smart</span>
            <h3>Where the ADHD tax actually hides</h3>
            <p>The five quiet leaks draining your account — and how to plug them this week.</p>
            <span className="rd">Read article <span className="arrow">→</span></span>
          </div>
        </article>
      </div>
    </div>
  </section>

  
  <section className="panel closer" data-screen-label="Closer">
    <div className="closer-media" aria-hidden="true">
      <img src="98bcbb3b-23d9-4f92-8ac0-a5824297d52d" alt="" />
      <div className="scrim"></div>
    </div>
    <div className="wrap">
      <div className="panel-head reveal" style={{"marginBottom":"clamp(28px,4vh,52px)"}}>
        <span className="label">The invitation</span>
        <span className="idx">06 / 06</span>
      </div>
      <h2 className="reveal d1">
        Support that fits how your brain <span className="accent">actually works.</span>
      </h2>
      <div className="actions reveal d2">
        <Link href="https://wa.me/447591922247?text=Hi%20SOR7ED%20%E2%80%94%20I'd%20like%20to%20get%20started." data-link="whatsapp" className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14c-.2.7-1.2 1.3-1.7 1.4-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2 .9.8 1.7 1 2 1.2.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9 1c.3.1.4.2.5.3.1.2.1.7-.2 1.4Z"></path></svg>
          Start on WhatsApp <span className="arrow">→</span>
        </Link>
        <Link href="https://sor7ed.com" data-link="branches" className="btn btn-ghost">Explore the 7 branches <span className="arrow">→</span></Link>
      </div>
      <p className="micro reveal d3">No app. &nbsp;·&nbsp; No subscription required. &nbsp;·&nbsp; No nonsense.</p>
    </div>
  </section>

</main>

      <footer>
  <div className="wrap foot-in">
    <span><Link className="brand-logo" href="https://sor7ed.com" data-link="home" aria-label="SOR7ED home" style={{"verticalAlign":"middle","marginRight":"14px"}}><img src="ef90b96a-f218-4709-af99-8c8926dbc6f5" alt="SOR7ED" style={{"height":"22px","opacity":".9"}} /></Link>Practical protocols for neurodivergent minds</span>
    <span>© 2026 · hello@sor7ed.com · Skip the nonsense</span>
  </div>
</footer>
    </>
  );
}
