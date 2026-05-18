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

function up(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' } as const,
  };
}

export default function HomeClient() {
  return (
    <div className="bg-ps-black text-ps-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-16 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-5xl mx-auto">
          <motion.p {...up(0)} className="label-yellow mb-6">
            Practical tools for when life is too much
          </motion.p>

          <motion.h1 {...up(0.08)} className="display-xl text-ps-white mb-6 max-w-3xl">
            Sort out what&apos;s stopping you.
          </motion.h1>

          <motion.p {...up(0.15)} className="text-ps-white/60 text-lg max-w-xl leading-relaxed mb-10">
            Answer 4 questions. Get a personalised protocol delivered straight to your WhatsApp — no app, no login, under 2 minutes.
          </motion.p>

          <motion.div {...up(0.2)} className="flex flex-wrap gap-3 mb-16">
            <Link href="/tools" className="btn-yellow">
              Take an assessment
            </Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Text on WhatsApp
            </a>
          </motion.div>

          {/* Quick tap */}
          <motion.div {...up(0.28)}>
            <p className="label mb-4">What&apos;s happening right now?</p>
            <div className="flex flex-wrap gap-2">
              {PROBLEMS.map(p => (
                <a
                  key={p.text}
                  href={`${WA}?text=${encodeURIComponent(p.keyword)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-ps-white/70 border border-ps-white/15 rounded-full hover:border-ps-yellow hover:text-ps-yellow transition-all"
                >
                  {p.text}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-16 py-20 border-t border-ps-white/10">
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="label-yellow mb-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            How it works
          </motion.p>
          <motion.h2
            className="display-md text-ps-white mb-12"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Three steps. That&apos;s it.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ps-white/10">
            {[
              { n: '01', title: 'Pick your situation',  body: "Choose a tool that matches what you're dealing with right now." },
              { n: '02', title: 'Answer 4 questions',   body: 'Short, targeted questions — done in under 2 minutes.' },
              { n: '03', title: 'Get your plan',        body: 'One tap sends your personalised protocol straight to WhatsApp.' },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                className="bg-ps-black p-8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="display-lg text-ps-yellow block mb-5">{s.n}</span>
                <h3 className="font-display uppercase text-ps-white text-sm tracking-wide mb-3">{s.title}</h3>
                <p className="text-ps-white/50 text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 AREAS ──────────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-16 py-20 border-t border-ps-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="label-yellow mb-3">7 areas of life</p>
              <h2 className="display-md text-ps-white">Every part of your life, covered.</h2>
            </div>
            <Link href="/tools" className="btn-outline self-start sm:self-auto shrink-0">
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-ps-white/10">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.slug}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/${branch.slug}`}
                  className="group block bg-ps-black hover:bg-ps-yellow/5 p-5 transition-colors h-full"
                >
                  <span className="text-2xl block mb-3">{branch.icon}</span>
                  <p className="label mb-1">{branch.num}</p>
                  <h3 className="font-display uppercase text-ps-white text-sm tracking-wide group-hover:text-ps-yellow transition-colors mb-1">
                    {branch.name}
                  </h3>
                  <p className="text-ps-white/40 text-xs leading-relaxed line-clamp-2">{branch.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-16 py-24 border-t border-ps-white/10">
        <div className="max-w-3xl mx-auto">
          <motion.p className="label-yellow mb-5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ready?
          </motion.p>
          <motion.h2
            className="display-lg text-ps-white mb-6"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Pick a tool. Get sorted.
          </motion.h2>
          <motion.p
            className="text-ps-white/50 text-base max-w-lg leading-relaxed mb-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            Free. No account needed. Works on any phone.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          >
            <Link href="/tools" className="btn-yellow">Start an assessment</Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-outline">Text on WhatsApp</a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
