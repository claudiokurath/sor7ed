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

      {/* ── HERO — white ────────────────────────────── */}
      <section className="bg-white px-5 sm:px-8 md:px-12 pt-20 md:pt-24 pb-0 border-b-2 border-black">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8">
            <motion.h1
              className="font-display uppercase leading-none"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{ color: '#000' }}>SORT </span>
              <span style={{ WebkitTextStroke: '3px #000000', color: 'transparent' }}>WHAT&apos;S</span>
            </motion.h1>
            <motion.h1
              className="font-display uppercase leading-none"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <span style={{ color: '#FFD107' }}>STOPPING </span>
              <span style={{ color: '#000' }}>YOU.</span>
            </motion.h1>
          </div>

          <motion.div
            className="flex flex-col items-center gap-4 pb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-black/60 text-base max-w-md leading-relaxed">
              Answer 4 questions. Get a personalised protocol on WhatsApp. No app, no login — under 2 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Link href="/tools" className="btn-yellow">
                Take an assessment →
              </Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Text on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT'S HAPPENING — black ─────────────────── */}
      <section className="bg-black border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-white/10">
            <p className="label" style={{ color: '#888' }}>What&apos;s happening right now? Tap to send on WhatsApp.</p>
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
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ color: 'white', borderColor: 'white' }}>
              Text on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
