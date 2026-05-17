"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { branches } from '@/lib/constants';
import UniversalProblemSelector from './UniversalProblemSelector';

const taglines = [
  { word: 'Overwhelmed',        color: '#6366F1' },
  { word: 'Scattered',          color: '#A855F7' },
  { word: 'Exhausted',          color: '#FB7185' },
  { word: 'Wired differently',  color: '#06B6D4' },
];

export default function HomeClient() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-ps-gray-100 overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 md:px-16 py-20">

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-label mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Diagnose here. Solutions on WhatsApp.
          </motion.p>

          <motion.h1
            className="heading-display text-ps-black mb-2"
            style={{ fontSize: 'clamp(3rem, 6.4vw, 7rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            If you&apos;re feeling
          </motion.h1>

          <div
            className="mb-8 leading-none h-[1.1em] overflow-hidden"
            style={{ fontSize: 'clamp(3rem, 6.4vw, 7rem)', fontFamily: 'var(--font-anton)', textTransform: 'uppercase' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={taglineIndex}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ color: taglines[taglineIndex].color, display: 'block' }}
              >
                {taglines[taglineIndex].word}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-ps-gray-600 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Practical tools for when everything feels like too much. Diagnose your friction points, get a personalised protocol, delivered straight to your WhatsApp.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/tools" className="btn-primary px-8 py-4 text-sm">
              Take an Assessment
            </Link>
            <a href="#branches" className="btn-secondary px-8 py-4 text-sm">
              Explore the 7 Branches
            </a>
          </motion.div>

          {/* QR / WhatsApp direct */}
          <motion.div
            className="flex items-center gap-5 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <a
              href="https://wa.me/447591922247"
              target="_blank"
              rel="noopener noreferrer"
              className="block shrink-0 border-2 border-ps-black hover:shadow-brutal transition-all"
            >
              <Image
                src="/Images/QR.png"
                alt="Scan to open SOR7ED on WhatsApp"
                width={72}
                height={72}
                className="block"
              />
            </a>
            <div>
              <p className="text-ps-black text-sm font-black uppercase tracking-widest">Scan to chat on WhatsApp</p>
              <p className="text-ps-gray-500 text-xs mt-0.5">No app download. Just scan and go.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <UniversalProblemSelector />

      {/* 7 BRANCHES */}
      <section id="branches" className="px-4 sm:px-6 md:px-16 py-16 border-t-2 border-ps-gray-200">
        <motion.p
          className="text-label mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          7 Branches of Life
        </motion.p>

        <motion.h2
          className="heading-section text-ps-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Every part of your life,<br />simplified.
        </motion.h2>

        <motion.p
          className="text-ps-gray-600 text-base max-w-lg leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Complete a quick assessment to diagnose your specific blocks. Get personalised analysis instantly, then receive the unblocking protocol on WhatsApp.
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/${branch.slug}`}
                className="card-brutal card-brutal-hover flex flex-col justify-between h-[180px] p-5 block"
                style={{ ['--hover-color' as string]: branch.color }}
              >
                <div className="text-xs font-black uppercase tracking-[0.15em] text-ps-gray-400">
                  {branch.num}
                </div>
                <div>
                  <h3 className="text-base font-black mb-1 tracking-tight text-ps-black">
                    {branch.name}
                  </h3>
                  <p className="text-ps-gray-600 text-xs leading-relaxed line-clamp-2">
                    {branch.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="px-4 sm:px-6 md:px-16 py-24 border-t-4 border-ps-black bg-ps-black text-ps-white">
        <div className="max-w-4xl">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase text-ps-gray-500 mb-6 font-bold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.p>
          <motion.h2
            className="heading-display text-ps-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The world wasn&apos;t built for your brain. We build systems that are.
          </motion.h2>
          <motion.p
            className="text-ps-gray-400 text-lg max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Built using neuro-inclusive principles — designed for ADHD brains, used by anyone who needs life to be simpler. SOR7ED diagnoses your blocks on the web and delivers the right protocol to your phone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-ps-amber-500 text-ps-black border-2 border-ps-amber-500 font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-ps-white hover:border-ps-white transition-all"
            >
              Create your free account →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
