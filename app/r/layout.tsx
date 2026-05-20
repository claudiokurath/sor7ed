import type { ReactNode } from 'react';
import './pharmaceutical.css';

export default function RichLinksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pharmaceutical-container">
      {/* Ambient pharmaceutical glow background */}
      <div className="pharmaceutical-ambient">
        <div className="glow glow-teal" />
        <div className="glow glow-orange" />
        <div className="glow glow-cream" />
      </div>

      {/* Subtle film grain overlay */}
      <div className="film-grain" />

      <div className="pharmaceutical-content">
        {children}
      </div>
    </div>
  );
}
