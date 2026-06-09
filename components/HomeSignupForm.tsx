"use client";
import { useState } from "react";

export default function HomeSignupForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="card p-8 md:p-10 flex flex-col justify-center items-center text-center gap-5 shadow-medium border-[var(--color-accent)] animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
          <svg
            className="text-[var(--color-accent)] w-6 h-6"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--color-bone)]">
          You're in.
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-sm">
          Check WhatsApp — your first protocol is on the way. Start with one branch; build from there.
        </p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); setDone(true); }} 
      className="card p-8 md:p-10 flex flex-col gap-5 shadow-medium border-[var(--color-line)]"
    >
      <div className="t-mono text-[var(--color-accent)] font-bold text-[11px] mb-2 tracking-[0.12em]">
        Create your free account
      </div>
      
      {[
        { id: "f-name",  label: "First name",        type: "text",  placeholder: "Alex"             },
        { id: "f-email", label: "Email",              type: "email", placeholder: "you@email.com"    },
        { id: "f-wa",    label: "WhatsApp number",    type: "tel",   placeholder: "+44 7700 900000"  },
      ].map((f) => (
        <div key={f.id} className="flex flex-col gap-1.5">
          <label 
            htmlFor={f.id} 
            className="t-mono text-[10px] text-[var(--color-muted)] font-medium"
          >
            {f.label}
          </label>
          <input 
            id={f.id} 
            type={f.type} 
            placeholder={f.placeholder} 
            required 
            className="w-full bg-[var(--color-ink)] border border-[var(--color-line)] px-4 py-3 rounded-lg text-sm text-[var(--color-bone)] placeholder-[var(--color-muted)]/40 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-colors duration-200"
          />
        </div>
      ))}
      
      <button 
        type="submit" 
        className="btn btn-primary w-full justify-center text-center mt-3 py-3.5"
      >
        Create free account <span className="arrow">→</span>
      </button>
      
      <p className="t-mono text-[10.5px] text-[var(--color-muted)] leading-normal mt-1">
        By signing up, you'll be able to access practical support across all 7 branches whenever you need it.
      </p>
    </form>
  );
}
