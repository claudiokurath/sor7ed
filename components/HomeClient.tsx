"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { branches } from '@/lib/constants';

const taglines = [
  { word: 'Overwhelmed',       color: '#6366F1' },
  { word: 'Scattered',         color: '#A855F7' },
  { word: 'Exhausted',         color: '#FB7185' },
  { word: 'Wired differently', color: '#EBA904' },
];

const PROBLEMS = [
  { text: 'Too much to do',    sub: 'overwhelmed, can\'t start',  keyword: 'overwhelmed',  color: '#6366F1' },
  { text: 'Running on empty',  sub: 'exhausted, burnt out',       keyword: 'exhausted',    color: '#FB7185' },
  { text: 'Money stress',      sub: 'bills, chaos, avoidance',    keyword: 'money stress', color: '#10B981' },
  { text: 'Hard conversation', sub: 'argument, conflict',         keyword: 'argument',     color: '#F59E0B' },
  { text: "Can't focus",       sub: 'stuck, procrastinating',     keyword: 'stuck',        color: '#06B6D4' },
  { text: "Can't sleep",       sub: 'wired, anxious at night',    keyword: "can't sleep",  color: '#A855F7' },
];

const WA = 'https://wa.me/447591922247';

export default function HomeClient() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface-bg text-text-primary overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[92dvh] flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-12 pt-16 md:pt-20 overflow-hidden">

        {/* Amber gradient blob */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-xl max-h-xl rounded-full bg-brand-glow blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-sm max-h-sm rounded-full bg-[rgba(99,102,241,0.06)] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-label mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Diagnose here. Solutions on WhatsApp.
          </motion.p>

          <motion.h1
            className="font-display text-text-primary mb-2 leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            If you&apos;re feeling
          </motion.h1>

          <div
            className="mb-8 leading-none h-[1.1em] overflow-hidden"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontFamily: 'var(--font-display)' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={taglineIndex}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: taglines[taglineIndex].color, display: 'block', textTransform: 'uppercase' }}
              >
                {taglines[taglineIndex].word}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-text-secondary text-base sm:text-lg max-w-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Practical tools for when everything feels like too much. Diagnose your friction, get a personalised protocol — straight to WhatsApp.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Link href="/tools" className="btn-primary px-8 py-4 text-sm rounded-xl">
              Take an Assessment
            </Link>
            <a href="#what-now" className="btn-secondary px-8 py-4 text-sm rounded-xl">
              What&apos;s going on?
            </a>
          </motion.div>

          {/* QR / WhatsApp */}
          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="block shrink-0 border border-surface-border rounded-xl overflow-hidden hover:border-brand-amber transition-colors"
            >
              <Image
                src="/Images/QR.png"
                alt="Scan to open SOR7ED on WhatsApp"
                width={60}
                height={60}
                className="block"
              />
            </a>
            <div>
              <p className="text-text-primary text-xs font-black uppercase tracking-widest">Scan to chat on WhatsApp</p>
              <p className="text-text-muted text-xs mt-0.5">No app download. Just scan and go.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S GOING ON */}
      <section id="what-now" className="px-5 sm:px-8 md:px-16 py-16 border-t border-surface-border">
        <motion.p className="text-label mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Text what&apos;s wrong
        </motion.p>
        <motion.h2
          className="heading-section text-text-primary mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What&apos;s going on?
        </motion.h2>
        <motion.p
          className="text-text-muted text-sm max-w-md leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Tap what fits. We&apos;ll send the right tool to your WhatsApp — no app, no login.
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
          {PROBLEMS.map((p, i) => (
            <motion.a
              key={p.text}
              href={`${WA}?text=${encodeURIComponent(p.keyword)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-1.5 p-4 bg-surface-card border border-surface-border rounded-xl transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{
                boxShadow: `0 0 20px ${p.color}30`,
                borderColor: `${p.color}60`,
              }}
            >
              <p className="text-text-primary text-sm font-bold leading-tight">{p.text}</p>
              <p className="text-text-muted text-xs">{p.sub}</p>
            </motion.a>
          ))}
        </div>

        <motion.p
          className="mt-5 text-text-muted text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Or text anything — &ldquo;too much to do&rdquo;, &ldquo;can&apos;t sleep&rdquo;, &ldquo;burnt out&rdquo; — and I&apos;ll route you to the right tool.
        </motion.p>
      </section>

      {/* 7 BRANCHES */}
      <section className="py-16 border-t border-surface-border">
        <div className="px-5 sm:px-8 md:px-16 mb-6">
          <motion.p className="text-label mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            7 Branches of Life
          </motion.p>
          <motion.h2
            className="heading-section text-text-primary mb-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Every part of your life,<br />simplified.
          </motion.h2>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-5 sm:pl-8 md:pl-16 pr-4 pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pr-16">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              className="snap-start shrink-0 w-[72vw] sm:w-[280px] md:w-auto md:shrink"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/${branch.slug}`}
                className="group flex flex-col justify-between h-[160px] p-5 bg-surface-card border border-surface-border rounded-2xl transition-all duration-300 hover:border-brand-amber block"
                style={{ ['--hover-color' as string]: branch.color }}
              >
                <div className="text-xs font-black uppercase tracking-[0.15em] text-text-muted">
                  {branch.num}
                </div>
                <div>
                  <h3 className="text-sm font-black mb-1 tracking-tight text-text-primary group-hover:text-brand-amber transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
                    {branch.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="px-5 sm:px-8 md:px-16 py-20 border-t border-surface-border bg-surface-card">
        <div className="max-w-4xl">
          <motion.p
            className="text-label mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.p>
          <motion.h2
            className="heading-display text-text-primary mb-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The world wasn&apos;t built for your brain. We build systems that are.
          </motion.h2>
          <motion.p
            className="text-text-secondary text-base max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Built using neuro-inclusive principles — designed for ADHD brains, used by anyone who needs life to be simpler. SOR7ED diagnoses your blocks on the web and delivers the right protocol to your phone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/signup" className="btn-primary px-8 py-4 text-sm rounded-xl">
              Create your free account →
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
