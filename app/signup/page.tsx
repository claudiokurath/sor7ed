"use client";

import { useState, Suspense, useActionState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { handleSignupOrLogin, type ActionState } from '../actions/auth';
import { createClient } from '@/lib/supabase/client';

const countryCodes = [
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+1-us', flag: '🇺🇸', label: 'US', dialCode: '+1' },
  { code: '+1-ca', flag: '🇨🇦', label: 'CA', dialCode: '+1' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+64', flag: '🇳🇿', label: 'NZ' },
  { code: '+353', flag: '🇮🇪', label: 'IE' },
  { code: '+27', flag: '🇿🇦', label: 'ZA' },
  { code: '+31', flag: '🇳🇱', label: 'NL' },
  { code: '+49', flag: '🇩🇪', label: 'DE' },
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
  { code: '+39', flag: '🇮🇹', label: 'IT' },
  { code: '+46', flag: '🇸🇪', label: 'SE' },
  { code: '+47', flag: '🇳🇴', label: 'NO' },
  { code: '+45', flag: '🇩🇰', label: 'DK' },
  { code: '+358', flag: '🇫🇮', label: 'FI' },
  { code: '+41', flag: '🇨🇭', label: 'CH' },
  { code: '+32', flag: '🇧🇪', label: 'BE' },
  { code: '+351', flag: '🇵🇹', label: 'PT' },
  { code: '+48', flag: '🇵🇱', label: 'PL' },
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+65', flag: '🇸🇬', label: 'SG' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
];

const getDialCode = (code: string): string => {
  if (code === '+1-us' || code === '+1-ca') return '+1';
  return code;
};

function SignupForm() {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(() => searchParams.get('mode') === 'login');

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleSignupOrLogin,
    null
  );

  const searchParamError = searchParams.get('error');
  const isSuccess = state !== null && 'success' in state && state.success === true;
  const hasStateError = state !== null && 'error' in state;

  let status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  if (isPending) status = 'loading';
  else if (isSuccess) status = 'success';
  else if (hasStateError || searchParamError) status = 'error';

  const stateError = hasStateError ? (state as { error: string }).error : undefined;
  const errorMessage = stateError ??
    (searchParamError === 'auth_failed' ? 'Authentication failed. Please try again.' :
     searchParamError ? decodeURIComponent(searchParamError) : '');

  const dialCode = getDialCode(countryCode);
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '');
  const fullWhatsApp = `${dialCode}${cleanPhone}`;

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://sor7ed.com');
    const next = searchParams.get('next') ?? '/';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) console.error('Google sign-in error:', error.message);
  };

  const waVerifyCode = isSuccess && state !== null && 'waVerifyCode' in state ? state.waVerifyCode : undefined;
  const waNumber = isSuccess && state !== null && 'waNumber' in state ? state.waNumber : undefined;
  const waVerifyUrl = waVerifyCode && waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`VERIFY ${waVerifyCode}`)}`
    : null;

  const heroBanner = (
    <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src="/Images/banners/sign in banner.png" alt="Sign in banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
        <p className="t-label text-white/50 mb-3 font-mono tracking-widest">ACCOUNT</p>
        <h1 className="font-display font-black uppercase text-white leading-none max-w-2xl" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.01em' }}>
          {isLogin ? 'Welcome Back' : 'Sign Up Free'}
        </h1>
      </div>
    </section>
  );

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-black flex flex-col">
        {heroBanner}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <motion.div className="max-w-lg w-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="t-label text-accent mb-4">{isLogin ? 'Magic link sent' : 'Account created'}</p>
            <h1 className="t-display text-white mb-3">
              {!isLogin && firstName ? `YOU\'RE IN, ${firstName.toUpperCase()}.` : "YOU\'RE IN."}
            </h1>
            <p className="text-white/50 text-sm mb-10 leading-relaxed">
              {isLogin ? 'Check your inbox for the magic link to sign in.' : 'Two quick steps to activate your account.'}
            </p>
            <div className="space-y-3">
              <div className="card flex items-start gap-4 p-5">
                <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-display">1</div>
                <div className="flex-1">
                  <p className="font-display text-white text-xs uppercase tracking-widest mb-1">Confirm your email</p>
                  <p className="text-white/50 text-xs leading-relaxed">Magic link sent to <span className="text-white font-mono">{email}</span>. Click it to verify.</p>
                </div>
                <span className="text-white/30 text-[10px] font-display uppercase tracking-widest pt-1">Pending</span>
              </div>
              {!isLogin && (
                <>
                  {waVerifyUrl && waVerifyCode ? (
                    <div className="card border-accent shadow-large flex items-start gap-4 p-5">
                      <div className="w-8 h-8 bg-ps-yellow rounded-full flex items-center justify-center shrink-0 text-black text-sm font-display">2</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-white text-xs uppercase tracking-widest mb-1">Verify your WhatsApp</p>
                        <p className="text-white/50 text-xs leading-relaxed mb-4">Opens WhatsApp with your code pre-filled. Just hit send.</p>
                        <a href={waVerifyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent text-[10px] px-5 py-2.5 inline-flex items-center gap-2">
                          SEND VERIFY {waVerifyCode}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="card flex items-start gap-4 p-5 opacity-50">
                      <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center shrink-0 text-white/40 text-sm font-display">2</div>
                      <div>
                        <p className="font-display text-white text-xs uppercase tracking-widest mb-1">Verify your WhatsApp</p>
                        <p className="text-white/50 text-xs">Check your email first, then follow the WhatsApp step.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-white/30 text-[10px] font-display uppercase tracking-widest mt-8">
              {isLogin ? 'The magic link expires in 1 hour.' : 'Both steps must be completed to access your protocols.'}
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {heroBanner}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <Link href="/" className="text-white/40 text-[10px] font-display uppercase tracking-widest hover:text-accent transition-colors block mb-12">← Back to home</Link>
          <p className="t-label text-accent mb-4">SOR7ED</p>
          <h1 className="t-display text-white mb-3">{isLogin ? 'WELCOME BACK' : 'SIGN UP FREE'}</h1>
          <p className="text-white/50 text-sm mb-10 leading-relaxed">
            {isLogin ? 'Enter your email to receive a magic link to your dashboard.' : 'Create your account once. Then text any keyword to get step-by-step protocols on WhatsApp.'}
          </p>
          <button type="button" onClick={handleGoogleSignIn} className="btn border border-white/20 hover:border-white text-white w-full py-4 gap-3 mb-6 justify-center">
            Continue with Google
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/30 text-[10px] font-display uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="isLogin" value={String(isLogin)} />
            {!isLogin && <input type="hidden" name="whatsapp" value={fullWhatsApp} />}
            <input type="hidden" name="next" value={searchParams.get('next') ?? '/'} />
            {!isLogin && (
              <div>
                <label className="t-label mb-2 block">First Name</label>
                <input type="text" name="firstName" placeholder="What should we call you?" value={firstName} onChange={e => setFirstName(e.target.value)} required className="input" />
              </div>
            )}
            <div>
              <label className="t-label mb-2 block">Email</label>
              <input type="email" name="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="input" />
            </div>
            {!isLogin && (
              <div>
                <label className="t-label mb-2 block">WhatsApp Number</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="appearance-none bg-black text-white border border-white/20 rounded-xl pl-3 pr-7 py-3 focus:outline-none focus:border-accent transition-colors cursor-pointer text-sm" style={{ minWidth: '90px' }} aria-label="Country code">
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code} className="bg-black">{c.flag} {c.dialCode ?? c.code}</option>
                    ))}
                  </select>
                  <input type="tel" placeholder="7700 900000" value={phone} onChange={e => setPhone(e.target.value)} required className="input flex-1" />
                </div>
                {phone && <p className="text-white/40 text-xs mt-2 font-mono">Full number: {fullWhatsApp}</p>}
              </div>
            )}
            {status === 'error' && (
              <div role="alert" className="border border-red-500/50 bg-red-500/10 p-4 rounded">
                <p className="text-red-400 text-sm font-bold">{errorMessage}</p>
              </div>
            )}
            <button type="submit" disabled={isPending} className="btn btn-accent w-full py-4 mt-2 disabled:opacity-40 disabled:cursor-not-allowed">
              {isPending ? (isLogin ? 'SIGNING IN...' : 'CREATING ACCOUNT...') : (isLogin ? 'SIGN IN WITH MAGIC LINK →' : 'CREATE FREE ACCOUNT →')}
            </button>
          </form>
          <div className="flex items-center justify-center mt-8 pt-8 border-t border-white/10">
            <button type="button" onClick={() => setIsLogin(prev => !prev)} className="text-white/40 hover:text-accent text-[10px] font-display uppercase tracking-widest transition-colors">
              {isLogin ? "Don\'t have an account? Sign up here" : 'Already have an account? Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full" />
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}
