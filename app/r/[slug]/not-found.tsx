import Link from 'next/link';
import React from 'react';

export default function RichLinkNotFound() {
  return (
    <div className="pharmaceutical-card">
      <div className="pill-particles" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span 
            key={i} 
            className={`pill pill-${i % 3}`} 
            style={{
              '--delay': `${i * 0.3}s`,
              '--x': `${20 + (i * 12)}%`,
            } as React.CSSProperties} 
          />
        ))}
      </div>

      <div className="card-content">
        <div className="brand-badge">SOR7ED</div>
        
        <div className="error-code">404</div>
        
        <h1 className="card-title">Prescription Not Found</h1>
        <p className="card-description">
          This link has expired, been removed, or never existed in our pharmaceutical inventory.
        </p>
        
        <Link href="/" className="pharmaceutical-button">
          <span className="button-pill" />
          Return to Dispensary
        </Link>
      </div>
    </div>
  );
}
