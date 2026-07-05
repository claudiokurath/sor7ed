import { branches } from '../constants';

/**
 * Returns the brand color for a given branch name.
 * Supports both new and historical branch names as defined in constants and build docs.
 */
export function getBranchColor(branchName: string): string {
  const name = branchName?.trim().toLowerCase() || '';
  if (name.includes('keep going')) return '#3B82F6'; // Blue
  if (name.includes('feel good') || name.includes('body')) return '#A855F7'; // Purple
  if (name.includes('spend smart') || name.includes('wealth')) return '#10B981'; // Green
  if (name.includes('be connected') || name.includes('connection')) return '#F59E0B'; // Orange/Amber
  if (name.includes('plan ahead') || name.includes('tech')) return '#06B6D4'; // Cyan
  if (name.includes('be yourself') || name.includes('impression')) return '#FB7185'; // Rose
  if (name.includes('level up') || name.includes('growth')) return '#6366F1'; // Indigo
  return '#2dd4bf'; // Default fallback teal
}

/**
 * Escapes unsafe XML characters to prevent SVG syntax errors.
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Wraps text into lines based on maximum character length.
 */
function wrapText(text: string, maxCharsPerLine = 32): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + ' ' + word).trim();
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

/**
 * Generates a high-quality 1200x630 branded SVG cover image for blog posts/protocols.
 */
export function generateCoverSvg(
  title: string,
  branchName: string,
  keyword: string,
  slug: string
): string {
  const branchColor = getBranchColor(branchName);
  const cleanTitle = escapeXml(title);
  const cleanBranch = escapeXml(branchName || 'GENERAL');
  const cleanKeyword = escapeXml(keyword || 'START');
  const cleanSlug = escapeXml(slug || 'post');

  // Wrapping title words
  const titleLines = wrapText(title, 26);
  const titleTspans = titleLines
    .map((line, idx) => {
      const yOffset = 80 + idx * 56;
      return `<text x="0" y="${yOffset}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#ffffff" letter-spacing="-0.02em">${escapeXml(line)}</text>`;
    })
    .join('\n    ');

  const titleHeight = titleLines.length * 56;

  // Approximate badge widths
  const branchBadgeWidth = Math.max(100, cleanBranch.length * 7.5 + 24);
  const keywordBadgeWidth = Math.max(80, cleanKeyword.length * 8 + 24);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background dark gradient -->
    <radialGradient id="bg-glow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0c1618" />
      <stop offset="100%" stop-color="#05090a" />
    </radialGradient>
    
    <!-- Dynamic branch glow gradient -->
    <radialGradient id="branch-glow" cx="20%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${branchColor}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${branchColor}" stop-opacity="0" />
    </radialGradient>
    
    <!-- Blueprint pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${branchColor}" stroke-opacity="0.04" stroke-width="1.5" />
    </pattern>

    <!-- Linear gradient for dossier concentric circle blueprint -->
    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${branchColor}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0.02" />
    </linearGradient>

    <!-- Noise Filter -->
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="url(#bg-glow)" />
  
  <!-- Branch Ambient Glow -->
  <rect width="100%" height="100%" fill="url(#branch-glow)" />

  <!-- Blueprint Dossier Grid Overlay -->
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Abstract Blueprint Wireframe (Dossier Design on the right) -->
  <g opacity="0.7" transform="translate(860, 315)">
    <!-- Tech style blueprint layout -->
    <circle r="220" fill="none" stroke="url(#line-grad)" stroke-width="1" stroke-dasharray="3 9" />
    <circle r="160" fill="none" stroke="url(#line-grad)" stroke-width="1.5" />
    <circle r="80" fill="none" stroke="url(#line-grad)" stroke-width="2" />
    <circle r="4" fill="${branchColor}" opacity="0.4" />
    
    <line x1="-260" y1="0" x2="260" y2="0" stroke="url(#line-grad)" stroke-width="1.2" />
    <line x1="0" y1="-260" x2="0" y2="260" stroke="url(#line-grad)" stroke-width="1.2" />
    
    <!-- Diagnostic lines -->
    <path d="M-120,-120 L120,120 M-120,120 L120,-120" stroke="url(#line-grad)" stroke-width="0.8" stroke-dasharray="2 4" />
  </g>

  <!-- Decorative Outer Frame -->
  <rect x="30" y="30" width="1140" height="570" fill="none" stroke="${branchColor}" stroke-opacity="0.12" stroke-width="1.5" />
  
  <!-- Corner markings -->
  <path d="M 25,45 L 25,25 L 45,25" fill="none" stroke="#2dd4bf" stroke-opacity="0.3" stroke-width="2.5" />
  <path d="M 1175,45 L 1175,25 L 1155,25" fill="none" stroke="#2dd4bf" stroke-opacity="0.3" stroke-width="2.5" />
  <path d="M 25,585 L 25,605 L 45,605" fill="none" stroke="#2dd4bf" stroke-opacity="0.3" stroke-width="2.5" />
  <path d="M 1175,585 L 1175,605 L 1155,605" fill="none" stroke="#2dd4bf" stroke-opacity="0.3" stroke-width="2.5" />

  <!-- Film Grain Overlay -->
  <rect width="100%" height="100%" fill="none" /> <!-- placeholder to keep indexing simple -->

  <!-- Branding Header -->
  <g transform="translate(80, 95)">
    <!-- Styled SOR7ED Logo with custom color 7 -->
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" letter-spacing="0.3em" fill="#ffffff">
      SOR<tspan fill="#ff7a45">7</tspan>ED
    </text>
    <text x="190" y="-4" font-family="Courier New, monospace" font-weight="bold" font-size="12" letter-spacing="0.18em" fill="#2dd4bf" opacity="0.65">
      // SYSTEM PROTOCOL
    </text>
    <line x1="0" y1="18" x2="390" y2="18" stroke="#2dd4bf" stroke-opacity="0.2" stroke-width="1.5" />
  </g>

  <!-- Main Content Area -->
  <g transform="translate(80, 240)">
    <!-- Branch & Keyword Badges -->
    <g transform="translate(0, 0)">
      <!-- Branch Badge -->
      <rect x="0" y="0" width="${branchBadgeWidth}" height="32" rx="6" fill="#0c1618" stroke="${branchColor}" stroke-opacity="0.5" stroke-width="1.5" />
      <text x="${branchBadgeWidth / 2}" y="20" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="10" letter-spacing="0.18em" fill="${branchColor}" text-anchor="middle">
        ${cleanBranch.toUpperCase()}
      </text>

      <!-- Keyword Badge -->
      <rect x="${branchBadgeWidth + 12}" y="0" width="${keywordBadgeWidth}" height="32" rx="6" fill="#1c1917" stroke="#ff7a45" stroke-opacity="0.5" stroke-width="1.5" />
      <text x="${branchBadgeWidth + 12 + (keywordBadgeWidth / 2)}" y="20" font-family="Courier New, monospace" font-weight="bold" font-size="10" letter-spacing="0.15em" fill="#ff7a45" text-anchor="middle">
        ${cleanKeyword.toUpperCase()}
      </text>
    </g>

    <!-- Wrapped Title text -->
    <g transform="translate(0, 0)">
      ${titleTspans}
    </g>

    <!-- Classification/Indicator lines -->
    <text x="0" y="${titleHeight + 60}" font-family="Courier New, monospace" font-size="12" fill="#2dd4bf" opacity="0.45" letter-spacing="0.05em">
      CLASSIFICATION: ND OPERATING SYSTEM // RECORD: ACTIVE // STATUS: DEPLOYED
    </text>
  </g>

  <!-- Bottom Metadata Footer -->
  <g transform="translate(80, 545)">
    <text font-family="Courier New, monospace" font-size="11" fill="#ffffff" opacity="0.3">
      ID: ${cleanSlug.toUpperCase()} // AUTH: PUBLIC // VER: 2026.1
    </text>
  </g>

  <!-- Bottom Right WhatsApp CTA -->
  <g transform="translate(1120, 545)" text-anchor="end">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" letter-spacing="0.05em" fill="#ffffff" opacity="0.45">
      TEXT <tspan fill="#ff7a45" font-weight="900">"${cleanKeyword.toUpperCase()}"</tspan> TO +44 7591 922247 TO TRIGGER IN WHATSAPP
    </text>
  </g>
</svg>`;
}
