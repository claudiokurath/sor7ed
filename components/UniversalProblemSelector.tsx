"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";

const problems = [
  { text: "Too much to do",        sub: "overwhelmed, can't start",  whatsapp: "overwhelmed",    color: "#6366F1" },
  { text: "Running on empty",      sub: "exhausted, burnt out",       whatsapp: "exhausted",      color: "#FB7185" },
  { text: "Money stress",          sub: "bills, chaos, avoidance",    whatsapp: "money stress",   color: "#10B981" },
  { text: "Hard conversation",     sub: "argument, conflict",         whatsapp: "argument",       color: "#F59E0B" },
  { text: "Can't focus or start",  sub: "stuck, procrastinating",     whatsapp: "stuck",          color: "#06B6D4" },
  { text: "Can't sleep",           sub: "wired, anxious at night",    whatsapp: "can't sleep",    color: "#A855F7" },
];

export default function UniversalProblemSelector() {
  const waBase = `https://wa.me/${siteConfig.whatsappNumber}`;

  return (
    <section className="px-4 sm:px-6 md:px-16 py-16 border-t-2 border-ps-gray-200">
      <motion.p
        className="text-label mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Text what&apos;s wrong
      </motion.p>
      <motion.h2
        className="heading-section text-ps-black mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        What&apos;s going on?
      </motion.h2>
      <motion.p
        className="text-ps-gray-600 text-base max-w-md leading-relaxed mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        Tap what fits. We&apos;ll send the right tool to your WhatsApp — no app, no login.
      </motion.p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
        {problems.map((p, i) => (
          <motion.a
            key={p.text}
            href={`${waBase}?text=${encodeURIComponent(p.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-start gap-2 p-5 bg-ps-white border-2 border-ps-black transition-all duration-150 cursor-pointer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            style={{ ['--c' as string]: p.color }}
            whileHover={{ boxShadow: `3px 3px 0px 0px ${p.color}`, transform: 'translate(-1.5px,-1.5px)' }}
          >
            <div>
              <p className="text-ps-black text-sm font-black leading-tight">{p.text}</p>
              <p className="text-ps-gray-500 text-xs mt-0.5">{p.sub}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.p
        className="mt-6 text-ps-gray-400 text-xs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        Or text anything — &quot;too much to do&quot;, &quot;can&apos;t sleep&quot;, &quot;burnt out&quot; — and I&apos;ll route you to the right tool.
      </motion.p>
    </section>
  );
}
