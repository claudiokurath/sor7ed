"use client";

import { motion } from 'framer-motion';

type ArticleCoverProps = {
  keyword: string;
  branch: string;
  color: string;
  title: string;
  imageUrl?: string;
};

export default function ArticleCover({ keyword, branch, color, imageUrl }: ArticleCoverProps) {
  // SVG Film Grain overlay
  const grainStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`
  };

  if (imageUrl) {
    return (
      <div className="relative h-56 sm:h-80 w-full overflow-hidden rounded-2xl border border-white/10 group shadow-2xl">
        {/* Film grain layer */}
        <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-80" style={grainStyle} />
        
        {/* Retro Cinematic Color Overlay (Teal & Copper tone mapping) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-[#081F11]/40 via-transparent to-[#e76f51]/10 mix-blend-color-burn" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#080F11] via-[#080F11]/40 to-transparent" />
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.9] contrast-[1.05]"
        />

        {/* Floating Dossier Tag */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <span 
            className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#0f1719]/90 text-teal-400 border border-teal-500/30 backdrop-blur-sm"
          >
            {branch}
          </span>
          <span 
            className="text-[10px] font-mono uppercase tracking-[0.1em] px-2.5 py-1 rounded bg-[#1c1917]/90 text-[#ff7a45] border border-[#ff7a45]/30 backdrop-blur-sm"
          >
            {keyword}
          </span>
        </div>
      </div>
    );
  }

  // Fallback covers get the premium cinematic mesh gradient + grain styling
  return (
    <div
      className="relative h-56 sm:h-80 w-full overflow-hidden rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl"
      style={{ backgroundColor: '#080F11' }}
    >
      {/* Film grain layer */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-60" style={grainStyle} />

      {/* Cinematic Teal & Copper Mesh Gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `
            radial-gradient(circle at 15% 25%, rgba(13, 148, 136, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 85% 75%, rgba(234, 88, 12, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(15, 118, 110, 0.08) 0%, transparent 70%)
          `
        }}
      />

      {/* Large keyword watermark */}
      <motion.div
        className="absolute text-[100px] sm:text-[140px] font-black leading-none select-none pointer-events-none font-mono"
        style={{ 
          color: '#2dd4bf',
          opacity: 0.03,
          letterSpacing: '-0.06em'
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.03 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {keyword}
      </motion.div>

      {/* Centered keyword badge */}
      <div className="relative z-10 text-center px-4">
        <motion.div 
          className="inline-block px-8 py-3.5 rounded-2xl border mb-3 backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
            borderColor: 'rgba(13, 148, 136, 0.25)'
          }}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-mono font-black text-2xl tracking-[0.25em] text-[#ff7a45]">
            {keyword}
          </p>
        </motion.div>
        <p className="text-teal-400/50 text-[10px] font-bold uppercase tracking-[0.2em]">{branch}</p>
      </div>

      {/* Grid overlay to look like drafting blueprint / dossier */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45, 212, 191, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
}
