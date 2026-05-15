import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SOR7ED — 7 Branches of Life';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRANCHES = [
  { icon: '🧠', name: 'Cognitive', color: '#A855F7' },
  { icon: '⏱️', name: 'Temporal', color: '#F4A261' },
  { icon: '❤️', name: 'Emotional', color: '#E94560' },
  { icon: '💰', name: 'Financial', color: '#4ECDC4' },
  { icon: '👥', name: 'Social', color: '#FF6B6B' },
  { icon: '🏃', name: 'Physical', color: '#E9C46A' },
  { icon: '🏠', name: 'Environmental', color: '#4ECDC4' },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'white', fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>
            SOR<span style={{ color: '#E9C46A' }}>7</span>ED
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
            INTELLIGENCE FILE
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: 'white', fontSize: 72, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-3px' }}>
            7 branches
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 72, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-3px' }}>
            of your life.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22, marginTop: 16, fontWeight: 400 }}>
            Practical protocols for neurodivergent adults — delivered to WhatsApp.
          </div>
        </div>

        {/* Bottom: branch pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {BRANCHES.map((b) => (
            <div
              key={b.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: `${b.color}18`,
                border: `1px solid ${b.color}40`,
                borderRadius: 100,
                padding: '8px 20px',
                color: b.color,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {b.icon} {b.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
