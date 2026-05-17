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
    <section className="px-5 sm:px-8 md:px-16 py-16 border-t border-surface-border">
      <motion.p
        className="text-label mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
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
        {problems.map((p, i) => (
          <motion.a
            key={p.text}
            href={`${waBase}?text=${encodeURIComponent(p.whatsapp)}`}
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
  );
}
