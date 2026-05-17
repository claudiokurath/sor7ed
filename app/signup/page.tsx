"use client";

import { useState, Suspense, useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { handleSignupOrLogin, type ActionState } from '../actions/auth';
import { createClient } from '@/lib/supabase/client';

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

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
    });
  };

  const waVerifyCode = isSuccess && state !== null && 'waVerifyCode' in state ? state.waVerifyCode : undefined;
  const waNumber = isSuccess && state !== null && 'waNumber' in state ? state.waNumber : undefined;
  const waVerifyUrl = waVerifyCode && waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`VERIFY ${waVerifyCode}`)}`
    : null;

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-ps-gray-100 flex items-center justify-center px-6 py-20">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-label mb-4">Account created</p>
          <h1 className="heading-display text-ps-black mb-3">
            {firstName ? `You're in, ${firstName}.` : "You're in."}
          </h1>
          <p className="text-ps-gray-600 text-base mb-10 leading-relaxed">
            Two quick steps to activate your account.
          </p>

          <div className="space-y-3">
            {/* Step 1: Email */}
            <div className="flex items-start gap-4 p-5 bg-ps-white border-2 border-ps-black">
              <div className="w-8 h-8 bg-ps-black text-ps-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <p className="font-black text-sm text-ps-black mb-1 uppercase tracking-wide">Confirm your email</p>
                <p className="text-ps-gray-500 text-xs leading-relaxed">
                  Magic link sent to <span className="text-ps-black font-mono">{email}</span>. Click it to verify.
                </p>
              </div>
              <span className="text-ps-gray-400 text-xs uppercase tracking-widest font-bold pt-1 shrink-0">Pending</span>
            </div>

            {/* Step 2: WhatsApp */}
            {waVerifyUrl && waVerifyCode ? (
              <div className="flex items-start gap-4 p-5 bg-ps-white border-2 border-ps-black shadow-brutal">
                <div className="w-8 h-8 bg-ps-black text-ps-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-ps-black mb-1 uppercase tracking-wide">Verify your WhatsApp</p>
                  <p className="text-ps-gray-500 text-xs leading-relaxed mb-4">
                    Tap below — opens WhatsApp with your code pre-filled. Just hit send.
                  </p>
                  <a
                    href={waVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Send VERIFY {waVerifyCode}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-5 bg-ps-white border-2 border-ps-gray-200">
                <div className="w-8 h-8 bg-ps-gray-200 text-ps-gray-500 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-black text-sm text-ps-black mb-1 uppercase tracking-wide">Verify your WhatsApp</p>
                  <p className="text-ps-gray-500 text-xs">Check your email first, then follow the WhatsApp step.</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-ps-gray-400 text-xs mt-8 font-bold uppercase tracking-widest">
            Both steps must be completed to access your protocols.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ps-gray-100 flex">
      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">

          <Link href="/" className="text-ps-gray-500 text-xs font-bold uppercase tracking-widest hover:text-ps-black transition-colors block mb-12">
            ← Back to home
          </Link>

          <p className="text-label mb-4">SOR7ED</p>
          <h1 className="heading-display text-ps-black mb-3">
            {isLogin ? 'Welcome back' : 'Sign up for free'}
          </h1>
          <p className="text-ps-gray-600 text-base mb-10 leading-relaxed">
            {isLogin
              ? 'Enter your email to receive a magic link to your dashboard.'
              : 'Create your account once. Then text any keyword to get step-by-step protocols delivered straight to your WhatsApp.'
            }
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-ps-white border-2 border-ps-black px-4 py-4 text-ps-black font-bold text-sm uppercase tracking-widest hover:bg-ps-black hover:text-ps-white transition-all mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-ps-gray-200" />
            <span className="text-ps-gray-400 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-ps-gray-200" />
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="isLogin" value={String(isLogin)} />
            <input type="hidden" name="whatsapp" value={fullWhatsApp} />

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-ps-gray-500 text-xs uppercase tracking-widest block mb-2 font-bold">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="What should we call you?"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-ps-white border-2 border-ps-black px-4 py-4 text-ps-black placeholder-ps-gray-400 focus:outline-none focus:shadow-brutal transition-all"
                />
              </motion.div>
            )}

            <div>
              <label className="text-ps-gray-500 text-xs uppercase tracking-widest block mb-2 font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-ps-white border-2 border-ps-black px-4 py-4 text-ps-black placeholder-ps-gray-400 focus:outline-none focus:shadow-brutal transition-all"
              />
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-ps-gray-500 text-xs uppercase tracking-widest block mb-2 font-bold">
                  WhatsApp Number
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="appearance-none bg-ps-white border-2 border-ps-black pl-4 pr-8 py-4 text-ps-black focus:outline-none focus:shadow-brutal transition-all cursor-pointer"
                      style={{ minWidth: '110px' }}
                    >
                      {countryCodes.map((country, i) => (
                        <option key={i} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ps-gray-500 text-xs">▾</div>
                  </div>
                  <input
                    type="tel"
                    placeholder="7700 900000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required={!isLogin}
                    className="flex-1 bg-ps-white border-2 border-ps-black px-4 py-4 text-ps-black placeholder-ps-gray-400 focus:outline-none focus:shadow-brutal transition-all"
                  />
                </div>
                {phone && (
                  <p className="text-ps-gray-500 text-xs mt-2 font-mono">
                    Full number: {fullWhatsApp}
                  </p>
                )}
              </motion.div>
            )}

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  className="bg-ps-white border-2 border-ps-danger p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-ps-danger text-sm font-bold">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-ps-white/30 border-t-ps-white"
                  />
                  {isLogin ? 'Signing in...' : 'Creating your account...'}
                </span>
              ) : (
                isLogin ? 'Sign in with Magic Link →' : 'Create free account →'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-ps-gray-200 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-ps-gray-500 hover:text-ps-black text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up here"
                : "Already have an account? Sign in here"
              }
            </button>
          </div>
        </div>
      </div>

      {/* Image panel — desktop only */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 relative bg-ps-amber-500">
        <Image
          src="/Images/chaos-portrait.png"
          alt="Life before SOR7ED — chaotic desk"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 bg-ps-black/10" />
        <div className="absolute top-12 left-10 right-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-ps-black/50 mb-3">Sound familiar?</p>
          <h2 className="font-anton text-3xl text-ps-black leading-snug uppercase tracking-wide">
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
      <main className="min-h-screen bg-ps-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ps-gray-300 border-t-ps-black animate-spin" />
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}
