"use client";
import { useState } from "react";

export default function HomeSignupForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "30px 10px" }}>
        <svg
          style={{ color: "var(--hp-accent)", width: "44px", height: "44px", margin: "0 auto 16px", display: "block" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <h3 style={{
          fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 800,
          fontSize: "26px", marginBottom: "10px", color: "#eaf1ee",
        }}>
          You&apos;re in.
        </h3>
        <p style={{ color: "var(--hp-muted)" }}>
          Check WhatsApp — your first protocol is on the way. Start with one branch; build from there.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: "12px",
        textTransform: "uppercase", letterSpacing: ".06em", color: "var(--hp-accent)", marginBottom: "18px",
      }}>
        Create your free account
      </div>
      {[
        { id: "f-name",  label: "First name",        type: "text",  placeholder: "Alex"             },
        { id: "f-email", label: "Email",              type: "email", placeholder: "you@email.com"    },
        { id: "f-wa",    label: "WhatsApp number",    type: "tel",   placeholder: "+44 7700 900000"  },
      ].map((f) => (
        <div key={f.id} className="hp-field">
          <label htmlFor={f.id}>{f.label}</label>
          <input id={f.id} type={f.type} placeholder={f.placeholder} required />
        </div>
      ))}
      <button type="submit" className="hp-btn hp-btn-primary" style={{ justifyContent: "center", marginTop: "4px" }}>
        Create free account →
      </button>
      <p style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: "11.5px",
        color: "var(--hp-muted)", lineHeight: 1.6,
      }}>
        By signing up, you&apos;ll be able to access practical support across all 7 branches whenever you need it.
      </p>
    </form>
  );
}
