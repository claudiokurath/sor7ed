"use client";

import { motion } from 'framer-motion';

type KeywordTokenProps = {
  keyword: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
};

export default function KeywordToken({ 
  keyword, 
  color, 
  size = 'medium', 
  interactive = false 
}: KeywordTokenProps) {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  };

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 rounded-full font-mono font-bold tracking-widest
        border transition-all duration-200 ${sizeClasses[size]}
        ${interactive ? 'cursor-pointer hover:scale-105' : ''}
      `}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color: color,
        boxShadow: `0 2px 8px ${color}20`
      }}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
    >
      <span className="text-xs opacity-60">📱</span>
      {keyword}
    </motion.div>
  );
}
