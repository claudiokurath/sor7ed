"use client";

import { useState, Suspense, useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { handleSignupOrLogin, type ActionState } from '../actions/auth';

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

function SignupForm() {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') === 'login');

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(handleSignupOrLogin, null);

  const searchParamError = searchParams.get('error');
  const isSuccess = state !== null && 'success' in state && state.success === true;
  const status: 'idle' | 'loading' | 'success' | 'error' =
    isPending ? 'loading' :
    isSuccess ? 'success' :
    (('error' in (state ?? {})) || searchParamError) ? 'error' :
    'idle';

  const stateError = state !== null && 'error' in state ? state.error : undefined;
  const errorMessage = stateError ??
    (searchParamError === 'auth_failed'
      ? 'Authentication failed. Please try again.'
      : searchParamError
        ? decodeURIComponent(searchParamError)
        : '');

  const fullWhatsApp = `${countryCode}${phone.replace(/\D/g, '').replace(/^0/, '')}`;

  const waVerifyCode = isSuccess && state !== null && 'waVerifyCode' in state ? state.waVerifyCode : undefined;
  const waNumber = isSuccess && state !== null && 'waNumber' in state ? state.waNumber : undefined;
  const waVerifyUrl = waVerifyCode && waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`VERIFY ${waVerifyCode}`)}`
    : null;

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-12">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-center">
            {firstName ? `You're in, ${firstName}.` : "You're in."}
          </h1>
          <p className="text-white/40 text-base mb-10 text-center">
            Two quick steps to activate your account.
          </p>

          <div className="space-y-4">
            {/* Step 1: Email */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-sm font-black">1</div>
              <div className="flex-1">
                <p className="font-black text-sm mb-1">Confirm your email</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Magic link sent to <span className="text-white/60 font-mono">{email}</span>. Click it to verify.
                </p>
              </div>
              <span className="text-white/20 text-xs uppercase tracking-widest font-bold pt-1 shrink-0">Pending</span>
            </div>

            {/* Step 2: WhatsApp */}
            {waVerifyUrl && waVerifyCode ? (
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 mt-0.5 text-sm font-black text-[#25D366]">2</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm mb-1">Verify your WhatsApp</p>
                  <p className="text-white/40 text-xs leading-relaxed mb-3">
                    Tap below — opens WhatsApp with your code pre-filled. Just hit send.
                  </p>
                  <a
                    href={waVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-black text-sm bg-[#25D366] text-black hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Send VERIFY {waVerifyCode}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 mt-0.5 text-sm font-black text-[#25D366]">2</div>
                <div>
                  <p className="font-black text-sm mb-1">Verify your WhatsApp</p>
                  <p className="text-white/40 text-xs">Check your email first, then follow the WhatsApp step.</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-white/20 text-xs mt-8">
            Both steps must be completed to access your protocols.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">

        <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors block mb-12">
          ← Back to home
        </Link>

        <p className="text-white/30 text-xs tracking-widest uppercase mb-4 font-medium">SOR7ED</p>
        <h1 className="text-4xl font-black mb-3 tracking-tight">
            {isLogin ? 'Welcome back' : 'Sign up for free'}
        </h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
            {isLogin 
                ? 'Enter your email to receive a magic link to your dashboard.' 
                : 'Create your account once. Then text any keyword to get step-by-step protocols delivered straight to your WhatsApp.'
            }
        </p>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="isLogin" value={String(isLogin)} />
          <input type="hidden" name="whatsapp" value={fullWhatsApp} />

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
                First Name
                </label>
                <input
                type="text"
                name="firstName"
                placeholder="What should we call you?"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
            </motion.div>
          )}

          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {!isLogin && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5"
            >
                <div>
                    <label className="text-white/50 text-xs uppercase tracking-widest block mb-2 font-medium">
                    WhatsApp Number
                    </label>
                    <div className="flex gap-2">
                        <div className="relative">
                            <select
                            value={countryCode}
                            onChange={e => setCountryCode(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-8 py-4 text-white focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                            style={{ minWidth: '110px' }}
                            >
                            {countryCodes.map((country, i) => (
                                <option key={i} value={country.code} className="bg-[#1a1a1a] text-white">
                                {country.flag} {country.code}
                                </option>
                            ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▾</div>
                        </div>
                        <input
                        type="tel"
                        placeholder="7700 900000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required={!isLogin}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>
                    {phone && (
                        <p className="text-white/30 text-xs mt-2 font-mono">
                            Full number: {fullWhatsApp}
                        </p>
                    )}
                </div>
            </motion.div>
          )}

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
                {isLogin ? 'Signing in...' : 'Creating your account...'}
              </span>
            ) : (
              isLogin ? 'Sign in with Magic Link →' : 'Create free account →'
            )}
          </motion.button>

        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/40 hover:text-white text-sm transition-colors"
            >
                {isLogin
                    ? "Don't have an account? Sign up here"
                    : "Already have an account? Sign in here"
                }
            </button>
        </div>
      </div>
      </div>{/* end form panel */}

      {/* Image panel — desktop only */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 relative bg-[#EBA904]">
        <Image
          src="/Images/chaos-portrait.jpg"
          alt="Life before SOR7ED — chaotic desk"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute top-12 left-10 right-10">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40 mb-3">Sound familiar?</p>
          <h2 className="text-2xl font-black text-black leading-snug">
            This is what your brain feels like before SOR7ED.
          </h2>
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </main>
        }>
            <SignupForm />
        </Suspense>
    );
}
