import React from 'react';

export default function RichLinkLoading() {
  return (
    <div className="pharmaceutical-card">
      <div className="pill-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span 
            key={i} 
            className={`pill pill-${i % 3}`} 
            style={{
              '--delay': `${i * 0.2}s`,
              '--x': `${15 + (i * 10)}%`,
            } as React.CSSProperties} 
          />
        ))}
      </div>

      <div className="card-content">
        <div className="brand-badge">SOR7ED</div>
        
        <div className="loading-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring spinner-ring-delayed" />
        </div>
        
        <h2 className="card-title">Processing Route</h2>
        <p className="card-description">
          Preparing your pharmaceutical protocol...
        </p>
        
        <div className="loading-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
