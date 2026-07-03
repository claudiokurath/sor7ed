"use client";

import React, { useState, useEffect, useTransition, useActionState, useRef } from "react";
import { handleSignupOrLogin, ActionState } from "./actions/auth";

export default function HomePage() {
  // Navigation scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ADHD Tax Calculator state
  const [sliderLate, setSliderLate] = useState(35);
  const [sliderImpulse, setSliderImpulse] = useState(80);
  const [sliderLost, setSliderLost] = useState(25);
  const [sliderSubs, setSliderSubs] = useState(22);

  const monthlyTotal = sliderLate + sliderImpulse + sliderLost + sliderSubs;
  const yearlyTotal = monthlyTotal * 12;

  // Find biggest leak
  const items = [
    { label: "Late fees & missed payments", value: sliderLate },
    { label: "Impulse buys you regret", value: sliderImpulse },
    { label: "Replacing lost or duplicate items", value: sliderLost },
    { label: "Forgotten subscriptions", value: sliderSubs },
  ];

  let maxValue = 0;
  let maxLabel = "";
  items.forEach((item) => {
    if (item.value > maxValue) {
      maxValue = item.value;
      maxLabel = item.label;
    }
  });

  const allZero = monthlyTotal === 0;

  // Form handling using React 19's useActionState
  const [formState, formAction, isPending] = useActionState(
    handleSignupOrLogin,
    null
  );

  // Scroll reveal references and setup
  const revealRef1 = useRef<HTMLElement>(null);
  const revealRef2 = useRef<HTMLElement>(null);
  const revealRef3 = useRef<HTMLElement>(null);
  const revealRef4 = useRef<HTMLElement>(null);
  const revealRef5 = useRef<HTMLElement>(null);
  const revealRef6 = useRef<HTMLElement>(null);
  const revealRef7 = useRef<HTMLElement>(null);
  const revealRef8 = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealRefs = [
      revealRef1,
      revealRef2,
      revealRef3,
      revealRef4,
      revealRef5,
      revealRef6,
      revealRef7,
      revealRef8,
    ];

    if (!prefersReduced && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      revealRefs.forEach((ref) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });

      return () => {
        observer.disconnect();
      };
    } else {
      revealRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.classList.add("visible");
        }
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* NAV */}
      <header className={`nav ${isScrolled ? "scrolled" : ""}`} id="top-nav">
        <div className="nav-inner">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="wordmark"
            aria-label="SOR7ED"
          >
            <span>SOR</span>
            <span>7</span>
            <span>ED</span>
          </a>
          <div className="nav-main">
            <nav className="nav-links" aria-label="Main navigation">
              <a
                href="#branches"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("branches");
                }}
              >
                Explore
              </a>
              <a
                href="#tools"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("tools");
                }}
              >
                Tools
              </a>
              <a
                href="#intelligence"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("intelligence");
                }}
              >
                Intelligence
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
              >
                How it works
              </a>
            </nav>
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("signup");
              }}
              className="btn btn-primary"
            >
              <span>Start on WhatsApp</span>
              <span className="arrow">→</span>
            </a>
          </div>
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="nav-toggle-line"></div>
            <div className="nav-toggle-line"></div>
          </button>
        </div>
      </header>

      {/* MOBILE NAV */}
      <nav
        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        id="mobile-nav"
        aria-label="Mobile navigation"
      >
        <a
          href="#branches"
          className="mobile-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("branches");
          }}
        >
          Explore
        </a>
        <a
          href="#tools"
          className="mobile-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("tools");
          }}
        >
          Tools
        </a>
        <a
          href="#intelligence"
          className="mobile-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("intelligence");
          }}
        >
          Intelligence
        </a>
        <a
          href="#how-it-works"
          className="mobile-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("how-it-works");
          }}
        >
          How it works
        </a>
        <a
          href="#signup"
          className="btn btn-primary"
          style={{ alignSelf: "flex-start", marginTop: "4px" }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("signup");
          }}
        >
          <span>Start on WhatsApp</span>
          <span className="arrow">→</span>
        </a>
      </nav>

      <main>
        {/* HERO */}
        <section id="hero" className="hero reveal" ref={revealRef1}>
          <div>
            <div className="hero-eyebrow">
              <span className="mono-label">For neurodivergent adults</span>
              <span className="badge-soft">
                <span className="badge-soft-dot"></span>
                <span>Skip the nonsense</span>
              </span>
            </div>
            <h1 className="hero-title">
              Practical protocols for <em>neurodivergent</em> minds
            </h1>
            <p className="hero-sub">
              Get step-by-step support for <strong>money, planning, burnout, relationships</strong> and daily life — delivered straight to your WhatsApp.
            </p>
            <div className="hero-actions">
              <a
                href="#tools"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("tools");
                }}
                className="btn btn-primary"
              >
                <span>Browse tools</span>
                <span className="arrow">→</span>
              </a>
              <a
                href="#branches"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("branches");
                }}
                className="btn btn-ghost"
              >
                <span>Explore the 7 Branches</span>
                <span className="arrow">→</span>
              </a>
            </div>
            <p className="hero-microcopy">
              No app. No subscription required. Start with one area and get practical support that actually fits how your brain works.
            </p>
          </div>

          <div className="hero-image" aria-hidden="true">
            <div className="hero-image-inner">
              <div className="hero-image-content">
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-num">7</div>
                    <div className="hero-stat-label">Branches</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">0</div>
                    <div className="hero-stat-label">New apps</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-num">∞</div>
                    <div className="hero-stat-label">Protocols</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-tag">Support, straight to your WhatsApp</div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip reveal" aria-label="Why SOR7ED" ref={revealRef2}>
          <div className="trust-item">
            <div className="trust-icon">🧠</div>
            <h4>Neurodivergent-first</h4>
            <p>Built for ADHD, autism, executive dysfunction &amp; burnout</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <h4>Delivered on WhatsApp</h4>
            <p>Support where you already are — no new app to learn</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">📋</div>
            <h4>Practical, step-by-step</h4>
            <p>Tools, articles &amp; protocols that reduce overwhelm</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🌿</div>
            <h4>Across 7 areas of life</h4>
            <p>Start anywhere with the area that matters most right now</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="reveal" ref={revealRef3}>
          <div className="section-header">
            <span className="mono-label">/ How SOR7ED works</span>
            <h2>Three steps. Built for how your brain actually works.</h2>
            <p>
              Start with the area that feels hardest right now — then follow practical support designed for the way you think, not against it.
            </p>
          </div>
          <div className="steps">
            <article className="step-card">
              <div className="step-number">Step 01</div>
              <h3>Pick your branch</h3>
              <p>
                Choose the part of life you want to improve first — from money and planning to energy, identity, and relationships.
              </p>
            </article>
            <article className="step-card">
              <div className="step-number">Step 02</div>
              <h3>Use a tool or protocol</h3>
              <p>
                Start with a calculator, article, or structured protocol that helps you understand the problem and take the next step.
              </p>
            </article>
            <article className="step-card">
              <div className="step-number">Step 03</div>
              <h3>Get support on WhatsApp</h3>
              <p>
                Receive step-by-step guidance without downloading another app or trying to hold everything in your head.
              </p>
            </article>
          </div>
          <div style={{ marginTop: "24px" }}>
            <a
              href="#branches"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("branches");
              }}
              className="btn btn-primary"
            >
              <span>See where to start</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </section>

        {/* THE 7 BRANCHES */}
        <section id="branches" className="reveal" ref={revealRef4}>
          <div className="section-header">
            <span className="mono-label">/ The 7 Branches</span>
            <h2>7 branches. One easier way to start.</h2>
            <p>
              SOR7ED organizes support across the seven areas most affected by executive dysfunction, ADHD, autism and burnout. Pick the one that matters most right now.
            </p>
          </div>
          <div className="branches-grid">
            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #3d7a5c 0%, #1f4a32 60%, #162d20 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">01 · Keep Going</div>
              <div className="branch-content">
                <div className="branch-title">Keep Going</div>
                <div className="branch-sub">Career, learning, momentum, progress</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #c9a87a 0%, #8a6040 60%, #5a3820 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">02 · Feel Good</div>
              <div className="branch-content">
                <div className="branch-title">Feel Good</div>
                <div className="branch-sub">Energy, sleep, meds, food, sensory support</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #5a9a8a 0%, #2a6a5a 60%, #1a3d32 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">03 · Spend Smart</div>
              <div className="branch-content">
                <div className="branch-title">Spend Smart</div>
                <div className="branch-sub">Bills, budgeting, impulse spending, money admin</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #9a7a6a 0%, #6a4a3a 60%, #3a2a20 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">04 · Be Connected</div>
              <div className="branch-content">
                <div className="branch-title">Be Connected</div>
                <div className="branch-sub">Relationships, communication, boundaries, scripts</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #7a9a6a 0%, #4a6a3a 60%, #2a3a20 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">05 · Plan Ahead</div>
              <div className="branch-content">
                <div className="branch-title">Plan Ahead</div>
                <div className="branch-sub">Planning, executive function, systems, follow-through</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #b09070 0%, #7a6040 60%, #4a3820 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">06 · Be Yourself</div>
              <div className="branch-content">
                <div className="branch-title">Be Yourself</div>
                <div className="branch-sub">Unmasking, identity, shame, self-concept, regulation</div>
              </div>
            </article>

            <article className="branch-tile" onClick={() => scrollToSection("signup")}>
              <div className="branch-image-wrap">
                <div
                  className="branch-bg"
                  style={{
                    background: "linear-gradient(145deg, #5a8a7a 0%, #2a5a4a 60%, #1a3028 100%)",
                  }}
                ></div>
                <div className="branch-scrim"></div>
              </div>
              <div className="branch-badge">07 · Level Up</div>
              <div className="branch-content">
                <div className="branch-title">Level Up</div>
                <div className="branch-sub">Digital systems, automation, apps, setups</div>
              </div>
            </article>

            {/* CTA Tile */}
            <article
              className="branch-tile branch-cta"
              aria-label="Explore all 7 branches"
              onClick={() => scrollToSection("signup")}
            >
              <div>
                <div className="branch-cta-main">
                  Explore all
                  <br />7 branches
                </div>
              </div>
              <div className="branch-cta-arrow">→</div>
            </article>
          </div>
        </section>

        {/* ADHD TAX CALCULATOR */}
        <section id="tools" className="reveal" ref={revealRef5}>
          <span className="mono-label">/ Tools</span>
          <div className="band" style={{ marginTop: "16px" }}>
            <div className="band-left">
              <div className="band-badge">★ Flagship tool · Spend Smart</div>
              <h2>The ADHD Tax Calculator</h2>
              <p className="band-intro">
                See how much ADHD-related habits may be costing you each year — from late fees and impulse spending to lost items and forgotten subscriptions.
              </p>
              <blockquote className="band-quote">
                This isn't a willpower problem. It's the ADHD tax — and once you can see it, you can start clawing it back.
              </blockquote>
              <div className="band-actions">
                <a
                  href="#signup"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("signup");
                  }}
                  className="btn btn-primary"
                >
                  <span>Get the full breakdown</span>
                  <span className="arrow">→</span>
                </a>
                <a
                  href="#tools"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("tools");
                  }}
                  className="btn btn-ghost"
                >
                  <span>Browse all tools</span>
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>

            <div className="calculator" aria-label="ADHD Tax Calculator">
              <div className="calc-row">
                <div className="calc-label-row">
                  <div className="calc-label">Late fees &amp; missed payments</div>
                  <div className="calc-value">£{sliderLate}</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={sliderLate}
                  onChange={(e) => setSliderLate(Number(e.target.value))}
                  aria-label="Late fees per month"
                />
              </div>
              <div className="calc-row">
                <div className="calc-label-row">
                  <div className="calc-label">Impulse buys you regret</div>
                  <div className="calc-value">£{sliderImpulse}</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={sliderImpulse}
                  onChange={(e) => setSliderImpulse(Number(e.target.value))}
                  aria-label="Impulse buys per month"
                />
              </div>
              <div className="calc-row">
                <div className="calc-label-row">
                  <div className="calc-label">Replacing lost or duplicate items</div>
                  <div className="calc-value">£{sliderLost}</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={sliderLost}
                  onChange={(e) => setSliderLost(Number(e.target.value))}
                  aria-label="Lost items per month"
                />
              </div>
              <div className="calc-row">
                <div className="calc-label-row">
                  <div className="calc-label">Forgotten subscriptions</div>
                  <div className="calc-value">£{sliderSubs}</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="2"
                  value={sliderSubs}
                  onChange={(e) => setSliderSubs(Number(e.target.value))}
                  aria-label="Forgotten subscriptions per month"
                />
              </div>

              <div className="calc-result">
                <div className="calc-result-title">Your estimated ADHD tax / year</div>
                <div className="calc-total">£{yearlyTotal.toLocaleString("en-GB")}</div>
                <div className="calc-leak">
                  {allZero ? (
                    "Drag the sliders to see where your ADHD tax might be hiding."
                  ) : (
                    <>
                      Biggest leak: <strong>{maxLabel}</strong> — about £
                      {(maxValue * 12).toLocaleString("en-GB")} a year.
                    </>
                  )}
                </div>
                <div className="calc-cta">
                  <a
                    href="#signup"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("signup");
                    }}
                    className="btn btn-primary"
                    style={{ marginTop: "12px" }}
                  >
                    <span>See how to reduce it</span>
                    <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTELLIGENCE / ARTICLES */}
        <section id="intelligence" className="reveal" ref={revealRef6}>
          <div className="section-header">
            <span className="mono-label">/ Intelligence</span>
            <h2>Articles that explain what's actually happening</h2>
            <p>
              We unpack the patterns behind burnout, loneliness, people-pleasing and money stress — with practical insight, not fluff. Read the protocol. Understand the pattern. Take the next step.
            </p>
          </div>
          <div className="articles-grid">
            <article className="article-card" onClick={() => scrollToSection("signup")}>
              <div>
                <div className="article-tag">Feel Good</div>
                <h3>The burnout loop nobody warned you about</h3>
                <p>
                  Why ND burnout isn't laziness — and the recovery protocol that doesn't rely on willpower.
                </p>
              </div>
              <div className="article-read">Read →</div>
            </article>
            <article className="article-card" onClick={() => scrollToSection("signup")}>
              <div>
                <div className="article-tag">Be Connected</div>
                <h3>People-pleasing is a nervous system, not a personality</h3>
                <p>Scripts and boundaries for when "no" feels physically impossible.</p>
              </div>
              <div className="article-read">Read →</div>
            </article>
            <article className="article-card" onClick={() => scrollToSection("signup")}>
              <div>
                <div className="article-tag">Spend Smart</div>
                <h3>Where the ADHD tax actually hides</h3>
                <p>
                  The five quiet leaks draining your account — and how to plug them this week.
                </p>
              </div>
              <div className="article-read">Read →</div>
            </article>
          </div>
          <div style={{ marginTop: "24px" }}>
            <a
              href="#intelligence"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("intelligence");
              }}
              className="btn btn-ghost"
            >
              <span>Read more from Intelligence</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </section>

        {/* SIGNUP */}
        <section id="signup" className="reveal" ref={revealRef7}>
          <div className="signup">
            <div>
              <div className="pill">Delivered on WhatsApp</div>
              <h2>Get SOR7ED on WhatsApp</h2>
              <p>
                Create your account once, then text a keyword to get step-by-step protocols delivered straight to your WhatsApp. Start free — no app, no subscription required.
              </p>
              <div className="signup-benefits">
                <div className="benefit-row">
                  <div className="benefit-check">✓</div>
                  <span>Access all 7 branches of support</span>
                </div>
                <div className="benefit-row">
                  <div className="benefit-check">✓</div>
                  <span>No new app to download or learn</span>
                </div>
                <div className="benefit-row">
                  <div className="benefit-check">✓</div>
                  <span>Start free, build from one step</span>
                </div>
                <div className="benefit-row">
                  <div className="benefit-check">✓</div>
                  <span>Protocols built for how you actually think</span>
                </div>
              </div>
            </div>
            <div className="form-card">
              {formState && "success" in formState ? (
                <div id="success-state">
                  <div className="success-icon">✅</div>
                  <div className="success-title">You're in.</div>
                  <p className="success-body">
                    Check WhatsApp — your first protocol is on the way.{" "}
                    {formState.waVerifyCode && (
                      <>
                        Your temporary WhatsApp verification code is:{" "}
                        <strong className="text-ps-yellow">{formState.waVerifyCode}</strong>.
                      </>
                    )}
                    {" "}Start with one branch; build from there.
                  </p>
                </div>
              ) : (
                <div id="form-wrapper">
                  <div className="form-title">Create your free account</div>
                  <form action={formAction}>
                    <div className="form-group">
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        placeholder="e.g. Alex"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@email.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="whatsapp">WhatsApp number</label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        placeholder="+44 7700 900000"
                        required
                      />
                    </div>
                    {formState && "error" in formState && (
                      <p style={{ color: "var(--warn)", fontSize: "12px", marginTop: "6px" }}>
                        {formState.error}
                      </p>
                    )}
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={isPending}>
                        <span>{isPending ? "Creating..." : "Create free account"}</span>
                        <span className="arrow">→</span>
                      </button>
                    </div>
                    <p className="form-microcopy">
                      By signing up, you'll be able to access practical support across all 7 branches whenever you need it. No spam, ever.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta reveal" ref={revealRef8}>
          <div>
            <h2>
              Ready to get <em>SOR7ED?</em>
            </h2>
            <p>
              You don't need to fix everything at once. Start with one branch, one tool, or one protocol — and build from there.
            </p>
          </div>
          <div className="final-cta-actions">
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("signup");
              }}
              className="btn btn-primary"
            >
              <span>Get started</span>
              <span className="arrow">→</span>
            </a>
            <a
              href="#branches"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("branches");
              }}
              className="btn btn-ghost"
            >
              <span>Explore the 7 Branches</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-wordmark">
                SOR<span>7</span>ED
              </div>
              <div className="footer-tagline">
                Practical protocols for neurodivergent minds — delivered to your WhatsApp. No app, no nonsense.
              </div>
            </div>
            <div className="footer-columns">
              <div>
                <div className="footer-col-title">Explore</div>
                <div className="footer-links">
                  <a
                    href="#branches"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("branches");
                    }}
                  >
                    The 7 Branches
                  </a>
                  <a
                    href="#tools"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("tools");
                    }}
                  >
                    Tools
                  </a>
                  <a
                    href="#intelligence"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("intelligence");
                    }}
                  >
                    Intelligence
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("how-it-works");
                    }}
                  >
                    How it works
                  </a>
                </div>
              </div>
              <div>
                <div className="footer-col-title">Start</div>
                <div className="footer-links">
                  <a
                    href="#signup"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("signup");
                    }}
                  >
                    Create free account
                  </a>
                  <a
                    href="#signup"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("signup");
                    }}
                  >
                    Get on WhatsApp
                  </a>
                  <a
                    href="#tools"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("tools");
                    }}
                  >
                    ADHD Tax Calculator
                  </a>
                </div>
              </div>
              <div>
                <div className="footer-col-title">Studio</div>
                <div className="footer-links">
                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("hero");
                    }}
                  >
                    About
                  </a>
                  <a
                    href="#signup"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("signup");
                    }}
                  >
                    Contact
                  </a>
                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("hero");
                    }}
                  >
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 SOR7ED</div>
            <div>Founder-led, privacy-conscious — "Skip the nonsense."</div>
          </div>
        </div>
      </footer>
    </>
  );
}
