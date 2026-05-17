"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { branches } from '@/lib/constants';

const taglines = [
  'OVERWHELMED',
  'SCATTERED',
  'EXHAUSTED',
  'WIRED DIFFERENTLY',
];

const PROBLEMS = [
  { text: 'Too much to do',    sub: "overwhelmed, can't start",  keyword: 'overwhelmed',  },
  { text: 'Running on empty',  sub: 'exhausted, burnt out',       keyword: 'exhausted',    },
  { text: 'Money stress',      sub: 'bills, chaos, avoidance',    keyword: 'money stress', },
  { text: 'Hard conversation', sub: 'argument, conflict',         keyword: 'argument',     },
  { text: "Can't focus",       sub: 'stuck, procrastinating',     keyword: 'stuck',        },
  { text: "Can't sleep",       sub: 'wired, anxious at night',    keyword: "can't sleep",  },
];

const WA = 'https://wa.me/447591922247';

export default function HomeClient() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTaglineIndex(i => (i + 1) % taglines.length), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-ps-black text-ps-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[94dvh] flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-14 pt-16 md:pt-20 border-b-2 border-ps-white">
        <div className="max-w-5xl">
          <motion.p className="label-yellow mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            Diagnose here. Solutions on WhatsApp.
          </motion.p>

          <motion.p
            className="font-display text-ps-white mb-2 leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            IF YOU&apos;RE FEELING
          </motion.p>

          <div className="h-[1.05em] overflow-hidden mb-10" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                className="font-display text-ps-yellow leading-none"
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -64, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {taglines[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-ps-white/60 text-base sm:text-lg max-w-xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Practical tools for when everything feels like too much. Diagnose your friction, get a personalised protocol — straight to WhatsApp.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link href="/tools" className="btn-yellow px-8 py-4">
              Take an Assessment
            </Link>
            <a href="#what-now" className="btn-outline px-8 py-4">
              What&apos;s going on?
            </a>
          </motion.div>

          {/* QR */}
          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="block shrink-0 border-2 border-ps-white hover:border-ps-yellow hover:shadow-hard-yellow transition-all"
            >
              <Image src="/Images/QR.png" alt="Scan to open SOR7ED on WhatsApp" width={60} height={60} className="block" />
            </a>
            <div>
              <p className="text-ps-white text-xs font-display uppercase tracking-widest">Scan to chat on WhatsApp</p>
              <p className="text-ps-white/40 text-xs mt-0.5">No app download. Just scan and go.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S GOING ON */}
      <section id="what-now" className="px-5 sm:px-8 md:px-16 py-16 border-b-2 border-ps-white">
        <motion.p className="label-yellow mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Text what&apos;s wrong
        </motion.p>
        <motion.h2
          className="display-lg text-ps-white mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What&apos;s going on?
        </motion.h2>
        <motion.p
          className="text-ps-white/50 text-sm max-w-md leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
              className="card-interactive flex flex-col gap-1.5 p-4 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="text-ps-white text-sm font-bold leading-tight">{p.text}</p>
              <p className="text-ps-white/40 text-xs">{p.sub}</p>
            </motion.a>
          ))}
        </div>

        <motion.p
          className="mt-5 text-ps-white/40 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Or text anything — &ldquo;too much to do&rdquo;, &ldquo;can&apos;t sleep&rdquo;, &ldquo;burnt out&rdquo; — and I&apos;ll route you to the right tool.
        </motion.p>
      </section>

      {/* 7 BRANCHES */}
      <section className="py-16 border-b-2 border-ps-white">
        <div className="px-5 sm:px-8 md:px-16 mb-6">
          <motion.p className="label-yellow mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            7 Branches of Life
          </motion.p>
          <motion.h2
            className="display-lg text-ps-white"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Every part of your life, simplified.
          </motion.h2>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-5 sm:pl-8 md:pl-16 pr-4 pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pr-16">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              className="snap-start shrink-0 w-[72vw] sm:w-[260px] md:w-auto md:shrink"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/${branch.slug}`}
                className="card-interactive flex flex-col justify-between h-[150px] p-5 block"
              >
                <div className="label text-ps-white/30">{branch.num}</div>
                <div>
                  <h3 className="text-ps-white text-sm font-display uppercase tracking-wide mb-1 group-hover:text-ps-yellow transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-ps-white/40 text-xs leading-relaxed line-clamp-2">{branch.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="px-5 sm:px-8 md:px-16 py-20">
        <div className="max-w-4xl">
          <motion.p className="label-yellow mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Our Mission
          </motion.p>
          <motion.h2
            className="display-xl text-ps-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The world wasn&apos;t built for your brain.<br />We build systems that are.
          </motion.h2>
          <motion.p
            className="text-ps-white/60 text-base max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Built using neuro-inclusive principles — designed for ADHD brains, used by anyone who needs life to be simpler. SOR7ED diagnoses your blocks on the web and delivers the right protocol to your phone.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/signup" className="btn-yellow px-8 py-4">
              Create your free account →
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
