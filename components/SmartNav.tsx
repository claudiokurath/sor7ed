"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SmartNav() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  // Only show on non-homepage after user scrolls
  useEffect(() => {
    if (pathname === '/') return;
    
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname === '/') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-white font-black text-lg tracking-tight">
              SOR7ED
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/tools" className="text-white/60 hover:text-white transition-colors">
                Assessments
              </Link>
              <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
                Articles
              </Link>
            </div>

            <Link 
              href="/signup" 
              className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:scale-105 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
