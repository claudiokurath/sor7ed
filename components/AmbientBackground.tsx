"use client";

import { useEffect, useRef } from 'react';

type AmbientBackgroundProps = {
  color: string;
  intensity?: 'low' | 'medium';
};

export default function AmbientBackground({ color, intensity = 'low' }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);

    const opacity = intensity === 'low' ? 0.02 : 0.04;
    
    // Parse hex color to RGB
    // Handling both #RRGGBB and potentially #RGB
    let r = 0, g = 0, b = 0;
    if (color.startsWith('#')) {
      if (color.length === 7) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
      } else if (color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
      }
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 3 slow-moving gradient orbs
      const orbs = [
        { x: 0.2, y: 0.3, size: 0.6, speed: 0.0002 },
        { x: 0.8, y: 0.7, size: 0.4, speed: 0.0003 },
        { x: 0.5, y: 0.1, size: 0.5, speed: 0.0001 },
      ];

      orbs.forEach((orb, i) => {
        const x = (orb.x + Math.sin(time * orb.speed + i * 2) * 0.05) * canvas.width;
        const y = (orb.y + Math.cos(time * orb.speed + i * 2) * 0.05) * canvas.height;
        const size = orb.size * Math.min(canvas.width, canvas.height) * 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateSize);
    };
  }, [color, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
