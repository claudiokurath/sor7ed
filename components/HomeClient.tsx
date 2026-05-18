"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const PROBLEMS = [
  { text: 'Too much to do',    keyword: 'overwhelmed'  },
  { text: 'Running on empty',  keyword: 'exhausted'    },
  { text: 'Money stress',      keyword: 'money stress' },
  { text: "Can't focus",       keyword: 'stuck'        },
  { text: "Can't sleep",       keyword: "can't sleep"  },
  { text: 'Hard conversation', keyword: 'argument'     },
];

const WA = 'https://wa.me/447591922247';

export default function HomeClient() {
  return (
    <div className="text-black">

      {/* ── HERO — split left/right ──────────────────── */}
      <section className="bg-white border-b-2 border-black" style={{ minHeight: '100dvh' }}>
        <div className="flex h-full" style={{ minHeight: '100dvh' }}>

          {/* Left panel — black, desktop only */}
          <div className="hidden md:flex w-64 lg:w-72 bg-black border-r-2 border-black flex-col items-center justify-between py-10 shrink-0 relative overflow-hidden" style={{ paddingTop: '5rem' }}>
            {/* Ghost 7 watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
              <span
                className="font-display leading-none"
                style={{
                  fontSize: '22rem',
                  WebkitTextStroke: '2px rgba(255,209,7,0.15)',
                  color: 'transparent',
                  userSelect: 'none',
                }}
              >
                7
              </span>
            </div>

            {/* Wordmark top */}
            <div className="relative z-10 self-start px-8">
              <span className="font-display text-lg tracking-widest text-white uppercase">
                SOR<span className="text-ps-yellow">7</span>ED
              </span>
            </div>

            {/* Vertical label centre */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <p
                className="font-display uppercase text-white/20 text-[10px] tracking-[0.4em]"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Human Performance System
              </p>
            </div>

            {/* Bottom — year + scroll hint */}
            <div className="relative z-10 self-start px-8 flex flex-col gap-4">
              <span className="label" style={{ color: '#444' }}>Est. 2026</span>
              <span className="text-white/20 text-xs font-display uppercase tracking-widest">↓ scroll</span>
            </div>
          </div>

          {/* Right panel — white, full content */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-14 pt-24 md:pt-0 pb-10">

            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <span className="label-yellow">Human Performance System</span>
            </motion.div>

            {/* 2-line headline */}
            <div className="mb-10">
              <motion.h1
                className="font-display uppercase leading-none"
                style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', letterSpacing: '-0.02em' }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                <span style={{ color: '#000' }}>SORT </span>
                <span style={{ WebkitTextStroke: '3px #000', color: 'transparent' }}>WHAT&apos;S</span>
              </motion.h1>
              <motion.h1
                className="font-display uppercase leading-none"
                style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', letterSpacing: '-0.02em' }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
              >
                <span style={{ color: '#FFD107' }}>STOPPING </span>
                <span style={{ color: '#000' }}>YOU.</span>
              </motion.h1>
            </div>

            {/* Divider */}
            <motion.div
              className="w-12 h-0.5 bg-black mb-8"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />

            {/* Description + CTA */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-black/55 text-base max-w-xs leading-relaxed">
                Answer 4 questions. Get a personalised protocol on WhatsApp. No app, no login — under 2 minutes.
              </p>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link href="/tools" className="btn-yellow">
                  Take an assessment →
                </Link>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Stat row */}
            <motion.div
              className="mt-12 pt-8 border-t-2 border-black/10 grid grid-cols-3 gap-6 max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {[
                { num: '7', label: 'Life areas' },
                { num: '4', label: 'Questions' },
                { num: '<2', label: 'Minutes' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl text-black leading-none mb-0.5">{s.num}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── WHAT'S HAPPENING — black ─────────────────── */}
      <section className="bg-black border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-white/10">
            <p className="label" style={{ color: '#555' }}>What&apos;s happening right now? Tap to send on WhatsApp.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <a
                key={p.text}
                href={`${WA}?text=${encodeURIComponent(p.keyword)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 border-white/10 hover:bg-ps-yellow transition-colors ${
                  i < PROBLEMS.length - (PROBLEMS.length % 3 || 3) ? 'border-b' : ''
                } ${i % 3 !== 2 ? 'md:border-r' : ''} ${i % 2 !== 1 ? 'sm:border-r md:border-r-0' : ''}`}
              >
                <span className="font-display uppercase text-sm tracking-wide text-white group-hover:text-black">
                  {p.text}
                </span>
                <span className="text-white/30 group-hover:text-black transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — yellow ────────────────────── */}
      <section className="bg-ps-yellow border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-black/15">
            <p className="label">How it works</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: '01', title: 'Pick your situation',  body: 'Choose a tool that matches what you\'re dealing with.' },
              { n: '02', title: 'Answer 4 questions',   body: 'Short and targeted. Done in under 2 minutes.' },
              { n: '03', title: 'Get your plan',        body: 'One tap sends your protocol straight to WhatsApp.' },
            ].map((s, i) => (
              <div key={s.n} className={`px-5 sm:px-8 md:px-12 py-10 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-black/15' : ''}`}>
                <div className="font-display text-6xl text-black/15 mb-4 leading-none">{s.n}</div>
                <h3 className="font-display uppercase text-base tracking-wide text-black mb-3">{s.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 AREAS — white ──────────────────────────── */}
      <section className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-black/10 flex items-center justify-between">
            <p className="label">7 areas of life</p>
            <Link href="/tools" className="label hover:text-black transition-colors">All tools →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {branches.map((branch, i) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className={`group block px-5 sm:px-6 py-7 hover:bg-black transition-colors border-black/10
                  ${i % 4 !== 3 ? 'md:border-r' : ''}
                  ${i % 3 !== 2 ? 'sm:border-r md:border-r-0' : ''}
                  ${i % 2 !== 1 ? 'border-r sm:border-r-0' : ''}
                  ${i < branches.length - 4 ? 'border-b' : ''}
                `}
              >
                <span className="text-2xl block mb-3">{branch.icon}</span>
                <p className="label mb-1">{branch.num}</p>
                <h3 className="font-display uppercase text-sm tracking-wide text-black group-hover:text-white mb-1">
                  {branch.name}
                </h3>
                <p className="text-black/40 group-hover:text-white/50 text-xs leading-relaxed line-clamp-2 transition-colors">{branch.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — black ───────────────────────────────── */}
      <section className="bg-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="font-display uppercase text-white leading-none" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            Ready to get sorted?
          </h2>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/tools" className="btn-yellow">Start free →</Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ color: 'white', borderColor: 'white' }}
            >
              Text on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
