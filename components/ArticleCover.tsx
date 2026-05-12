"use client";

import { motion } from 'framer-motion';

type ArticleCoverProps = {
  keyword: string;
  branch: string;
  color: string;
  title: string;
};

export default function ArticleCover({ keyword, branch, color, title }: ArticleCoverProps) {
  return (
    <div 
      className="relative h-48 sm:h-64 w-full overflow-hidden rounded-t-2xl flex items-center justify-center"
      style={{ backgroundColor: `${color}08` }}
    >
      {/* Subtle mesh gradient background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `
            radial-gradient(circle at 20% 30%, ${color}15 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${color}10 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${color}05 0%, transparent 70%)
          `
        }}
      />

      {/* Large keyword watermark */}
      <motion.div
        className="absolute text-[120px] sm:text-[160px] font-black leading-none select-none pointer-events-none"
        style={{ 
          color: color,
          opacity: 0.04,
          letterSpacing: '-0.05em'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.04 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {keyword}
      </motion.div>

      {/* Centered keyword badge */}
      <div className="relative z-10 text-center">
        <motion.div 
          className="inline-block px-6 py-3 rounded-2xl border mb-3"
          style={{ 
            backgroundColor: `${color}15`,
            borderColor: `${color}30`
          }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="font-mono font-black text-2xl tracking-[0.2em]" style={{ color }}>
            {keyword}
          </p>
        </motion.div>
        <p className="text-white/30 text-xs uppercase tracking-widest">{branch}</p>
      </div>

      {/* Subtle geometric pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
