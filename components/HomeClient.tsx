'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ROTATING_WORDS = [
  { text: 'Overwhelmed', color: '#E94560' },
  { text: 'Exhausted', color: '#FF6B6B' },
  { text: 'Wired differently', color: '#4ECDC4' },
  { text: 'Scattered', color: '#A855F7' },
  { text: 'Behind', color: '#F4A261' },
  { text: 'Stuck', color: '#E9C46A' },
];

const WHATSAPP_NUMBER = "+44 7591 922247";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=SOR7ED`;

export default function HomeClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_WORDS[currentIndex];

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: current.color }}
      />

      <div className="max-w-6xl mx-auto px-4 w-full relative z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8 block">
          Practical protocols via WhatsApp
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
          <span className="block">If you&apos;re feeling</span>
          <span
            className="block transition-all duration-500 ease-out"
            style={{
              color: current.color,
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
              filter: isAnimating ? 'blur(4px)' : 'blur(0)',
            }}
          >
            {current.text}
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed">
          SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href="/explore"
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full font-semibold transition inline-flex items-center gap-2"
          >
            Explore Your Branches
          </Link>
          <Link
            href="/signup"
            className="border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-full font-semibold transition"
          >
            Sign up for free protocols
          </Link>
        </div>

        <p className="text-sm text-white/30">
          Text <span className="text-white/50 font-mono">SOR7ED</span> to{' '}
          <a href={WHATSAPP_LINK} className="text-white/50 hover:text-white underline">
            {WHATSAPP_NUMBER}
          </a>
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
