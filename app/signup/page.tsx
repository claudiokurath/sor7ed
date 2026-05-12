"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const countryCodes = [
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
];

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Clean and format data
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = firstName.trim();
    
    // Format phone: remove all non-digits, handle leading zeros (common in UK/AU)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    const fullWhatsApp = `${countryCode}${cleanPhone}`;

    // 1. Store user data in database
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        first_name: cleanName,
        email: cleanEmail,
        whatsapp_number: fullWhatsApp
      });

    if (dbError) {
      setStatus('error');
      if (dbError.code === '23505') {
        setErrorMessage('That email or WhatsApp number is already signed up.');
      } else {
        setErrorMessage('Something went wrong saving your details. Please try again.');
      }
      return;
    }

    // 2. Trigger Magic Link sign-in
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setStatus('error');
      setErrorMessage(authError.message);
      return;
    }

    setStatus('success');
  }

  // Success screen with personalization
  if (status === 'success') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <motion.div
          className="max-w-lg w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <span className="text-3xl">✓</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Check your email, {firstName}.
          </h1>
          <p className="text-white/50 text-lg mb-12 leading-relaxed max-w-md mx-auto">
            We've sent a magic link to <strong>{email}</strong>. Click it to confirm your account and start receiving protocols on WhatsApp.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Signup form
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">

        <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
          ← Back to home
        </Link>

        <p className="text-white/30 text-xs tracking-widest uppercase mb-4 font-medium">SOR7ED</p>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Sign up for free</h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          Create your account once. Then text any keyword to get step-by-step protocols delivered straight to your WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First Name */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
              First Name
            </label>
            <input
              type="text"
              placeholder="What should we call you?"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* WhatsApp with Country Code */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
              WhatsApp Number
            </label>
            <div className="flex gap-2">

              {/* Country Code Dropdown */}
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-4 text-white focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                  style={{ minWidth: '110px' }}
                >
                  {countryCodes.map((country, i) => (
                    <option
                      key={i}
                      value={country.code}
                      className="bg-[#1a1a1a] text-white"
                    >
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">
                  ▾
                </div>
              </div>

              {/* Phone Number Input */}
              <input
                type="tel"
                placeholder="7700 900000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Live preview of formatted number */}
            {phone && (
              <motion.p
                className="text-white/30 text-xs mt-2 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Full number: {countryCode}{phone.replace(/\D/g, '').replace(/^0/, '')}
              </motion.p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                />
                Creating your account...
              </span>
            ) : (
              'Create free account →'
            )}
          </motion.button>

          <p className="text-white/20 text-xs text-center leading-relaxed mt-4">
            By signing up you agree to receive WhatsApp messages from SOR7ED. Text STOP anytime to unsubscribe.
          </p>

        </form>
      </div>
    </main>
  );
}
