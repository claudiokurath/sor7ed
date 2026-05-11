"use client";

import { useActionState } from 'react';
import Link from 'next/link';
import { signup } from '../actions/auth';

export default function Signup() {
    const [state, formAction, isPending] = useActionState(signup, null);

    // Success state - beautiful confirmation page
    if (state?.success) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
                <div className="max-w-lg w-full text-center">
                    <div className="text-6xl mb-8">✓</div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">You're in.</h1>
                    <p className="text-white/50 text-lg mb-12 leading-relaxed max-w-md mx-auto">
                        Find an article or tool that matches your situation, then text its keyword to receive your protocol on WhatsApp.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300"
                        >
                            Explore the branches →
                        </Link>
                        <Link
                            href="/blog"
                            className="block border border-white/10 text-white/70 font-semibold px-8 py-4 rounded-full hover:border-white/30 hover:text-white transition-all duration-300"
                        >
                            Browse articles
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Signup form
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
            <div className="max-w-md w-full">

                <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
                    ← Back to home
                </Link>

                <p className="text-white/30 text-xs tracking-widest uppercase mb-4 font-medium">SOR7ED</p>
                <h1 className="text-4xl font-black mb-3 tracking-tight">Sign up for free</h1>
                <p className="text-white/50 text-base mb-10 leading-relaxed">
                    Enter your email and WhatsApp number. Then text any keyword to receive protocols instantly.
                </p>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            name="whatsapp"
                            placeholder="+44 7700 900000"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        />
                        <p className="text-xs text-white/40 mt-2">
                            Include country code (e.g., +44 for UK, +1 for US)
                        </p>
                    </div>

                    {state?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-sm">{state.error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Creating your account...' : 'Create free account →'}
                    </button>
                </form>

            </div>
        </main>
    );
}

