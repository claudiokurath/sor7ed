"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";

const problems = [
    {
        emoji: "🌪️",
        text: "Too much to do",
        sub: "overwhelmed, can't start",
        whatsapp: "overwhelmed",
        color: "#6366F1",
    },
    {
        emoji: "😴",
        text: "Running on empty",
        sub: "exhausted, burnt out",
        whatsapp: "exhausted",
        color: "#FB7185",
    },
    {
        emoji: "💸",
        text: "Money stress",
        sub: "bills, chaos, avoidance",
        whatsapp: "money stress",
        color: "#34D399",
    },
    {
        emoji: "😤",
        text: "Hard conversation",
        sub: "argument, conflict",
        whatsapp: "argument",
        color: "#F59E0B",
    },
    {
        emoji: "🌀",
        text: "Can't focus or start",
        sub: "stuck, procrastinating",
        whatsapp: "stuck",
        color: "#06B6D4",
    },
    {
        emoji: "😶",
        text: "Can't sleep",
        sub: "wired, anxious at night",
        whatsapp: "can't sleep",
        color: "#A855F7",
    },
];

export default function UniversalProblemSelector() {
    const waBase = `https://wa.me/${siteConfig.whatsappNumber}`;

    return (
        <section className="px-4 sm:px-6 md:px-16 py-16 border-t border-white/5">
            <motion.p
                className="text-xs tracking-[0.35em] uppercase text-white/20 mb-4 font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                Text what&apos;s wrong
            </motion.p>
            <motion.h2
                className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                What&apos;s going on?
            </motion.h2>
            <motion.p
                className="text-white/30 text-base max-w-md leading-relaxed mb-10"
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
                        className="relative group flex flex-col items-start gap-2 p-4 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-300 cursor-pointer"
                        style={{ ["--c" as string]: p.color }}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                border: `1px solid ${p.color}40`,
                                boxShadow: `0 0 20px ${p.color}15`,
                            }}
                        />
                        <span className="text-2xl">{p.emoji}</span>
                        <div>
                            <p className="text-white/80 text-sm font-bold leading-tight group-hover:text-white transition-colors">
                                {p.text}
                            </p>
                            <p className="text-white/25 text-xs mt-0.5">{p.sub}</p>
                        </div>
                    </motion.a>
                ))}
            </div>

            <motion.p
                className="mt-6 text-white/15 text-xs"
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
