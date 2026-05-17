"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";

const problems = [
  { text: "Too much to do",       sub: "overwhelmed, can't start",  whatsapp: "overwhelmed"   },
  { text: "Running on empty",     sub: "exhausted, burnt out",       whatsapp: "exhausted"     },
  { text: "Money stress",         sub: "bills, chaos, avoidance",    whatsapp: "money stress"  },
  { text: "Hard conversation",    sub: "argument, conflict",         whatsapp: "argument"      },
  { text: "Can't focus or start", sub: "stuck, procrastinating",     whatsapp: "stuck"         },
  { text: "Can't sleep",          sub: "wired, anxious at night",    whatsapp: "can't sleep"   },
];

export default function UniversalProblemSelector() {
  const waBase = `https://wa.me/${siteConfig.whatsappNumber}`;

  return (
    <section className="px-5 sm:px-8 md:px-16 py-16 border-t-2 border-ps-white">
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
        {problems.map((p, i) => (
          <motion.a
            key={p.text}
            href={`${waBase}?text=${encodeURIComponent(p.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-interactive flex flex-col gap-1.5 p-4 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
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
  );
}
