
# SOR7ED – Master Document

## 📋 Table of Contents
- [Executive Summary](#executive-summary)
- [Goals for this Build](#goals-for-this-build)
- [Product Definition](#product-definition)
- [The Two-Layer Model](#the-two-layer-model)
- [WhatsApp as Remote Control](#whatsapp-as-remote-control)
- [The GET IT SOR7ED Button](#the-get-it-sor7ed-button)
- [Tool OS — Standard Results Page](#tool-os--standard-results-page)
- [Featured Tools](#featured-tools)
- [Monetization](#monetization)
- [Technical Stack](#technical-stack)
- [Architecture Overview](#architecture-overview)
- [Deployment & URLs](#deployment--urls)
- [Repository](#repository)
- [Database Schema](#database-schema)
- [Content Workflow](#content-workflow)
- [WhatsApp Messaging](#whatsapp-messaging)
- [Auth & Accounts](#auth--accounts)
- [SEO Strategy](#seo-strategy)
- [Cron Jobs](#cron-jobs)
- [Legal Pages](#legal-pages)
- [Environment Variables](#environment-variables)
- [Maintainer](#maintainer)
- [Version](#version)
- [Last Updated](#last-updated)

---

## Executive Summary
SOR7ED (pronounced "sorted") delivers practical protocols for neurodivergent adults across 7 branches of life. Content is authored in Notion, synced to Supabase every 5 minutes, and surfaced on the website as public articles and private member tools. The website delivers the value. WhatsApp is the remote control — users save content, run tools, and return to results via a single text message, with no new app required.

---

## Goals for this Build
- Fast, reliable website pulling content from Supabase (Notion → Supabase sync).
- WhatsApp as the remote control: every page has a "GET IT SOR7ED" button that opens WhatsApp with a pre-filled command.
- GDPR/PECR consent, crisis detection, STOP unsubscribes, opt-in weekly broadcasts.
- Clear free → paid conversion path (free = insight, paid = deliverable + continuity).
- SEO that surfaces "sorted" and neurodivergent search terms alongside "sor7ed".

---

## Product Definition

### What SOR7ED Is
- A content site (public) + tools platform (public free / paid gated).
- A WhatsApp remote control system — not a WhatsApp chatbot.
- A Notion-powered CMS with Supabase as the live database.

### What SOR7ED Is **Not**
- Not therapy.
- Not medical advice.
- Not a crisis service.
- Not a WhatsApp chatbot (WhatsApp is the remote, not the experience).

### The 7 Branches
1. Keep Going (executive function, routines, task initiation, momentum)
2. Spend Smart (bills, budgeting, subscriptions, ADHD tax)
3. Feel Good (burnout, medication, sleep, sensory needs, energy)
4. Plan Ahead (systems, calendars, digital setup, follow-through)
5. Be Connected (relationships, communication, boundaries, scripts)
6. Be Yourself (unmasking, identity, masking, shame, self-concept)
7. Level Up (career, skills, growth without burnout, digital systems)

---

## The Two-Layer Model

**Website = discovery + reading + running tools + results + account history**
**WhatsApp = the remote control**

WhatsApp is NOT the delivery channel. The website delivers the value. WhatsApp launches tools, saves content, opens last results, and lets users return to anything at any time — on a low-energy day, without remembering a URL.

What must always be true:
- Every WhatsApp reply can deep-link to a specific web screen.
- Every web screen has a "GET IT SOR7ED" button to continue in WhatsApp.
- Users can always text: MENU / HELP / LOGIN / STOP.

---

## WhatsApp as Remote Control

### Core Concept
WhatsApp is the remote control and permanent personal library for the user's saved tools and results. The website is where the value is delivered (tool results pages, articles, dashboard). WhatsApp is how users return to it — instantly, from any conversation, with one keyword.

### Command System
| Command | Behaviour |
|---------|-----------|
| `SAVE <slug>` | Save content/tool to personal WhatsApp library (always free) |
| `RUN <tool-slug>` | Execute a tool — this is what gets metered/paywalled |
| `ARTICLE <slug>` | Retrieve an article with its protocol |
| `LIBRARY` | Reprint all saved items with their links |
| `LOGIN` | Receive a magic link to the web dashboard |
| `HELP` / `MENU` | See available commands |
| `STOP` | Unsubscribe from all WhatsApp messages |
| `STOPWEEKLY` | Unsubscribe from weekly broadcast only |

### Tool Shorthand Triggers
Users can text these directly (treated as `RUN <slug>`):
| Keyword | Tool |
|---------|------|
| `TAX` | ADHD Tax Calculator |
| `AUTOPILOT` | Financial Autopilot |
| `CLARITY` | Decision Paralysis Solver |
| `DOPAMINE` | Dopamine Menu Generator |
| `TRIAGE` | Task Triage |
| `RSD` | RSD Response Scripts |
| `SENSORY` | Sensory Audit |
| `BURNOUT` | Burnout Assessment |

### Rich Preview System
When the bot sends a URL, it must render as a rich link card in WhatsApp:
- Every outbound WhatsApp message with a URL uses `preview_url: true`
- Bot responses use `sor7ed.com/r/[slug]` or `sor7ed.com/s/[id]` URLs — these serve full OG metadata (title, description, 1200×630 image) before redirecting to the target
- OG images: 1200×630px, public URL, under 300KB

### Save-to-Phone (authenticated users)
For logged-in users with a verified WhatsApp number, the "GET IT SOR7ED" button silently POSTs to `/api/save-to-phone`, which sends the page to their WhatsApp via the Meta API — no need to open WhatsApp manually.

---

## The GET IT SOR7ED Button

The most important UI element on the site. Appears on **every** article, tool page, and result page without exception.

**Behaviour:**
- Label: `GET IT SOR7ED`
- Helper text: "Opens WhatsApp with a ready-to-send message"
- Logged-out users: opens `wa.me/447360277713?text=SAVE%20[slug]` (or `RUN [slug]`)
- Logged-in users with verified WhatsApp: silently sends via `/api/save-to-phone`

**Context-specific copy:**
- On article pages: "Text this to get the full protocol on WhatsApp"
- On tool pages: "Text this to run the tool and save your result"
- On result pages: "Save your result to WhatsApp to come back to it later"

**Standard WhatsApp CTA block (end of every article):**
> Text [KEYWORD] to +44 7360 277713 to get the full protocol on WhatsApp.
> Sign up first at sor7ed.com. No app. No spam. Just what works.

**Key files:**
- `components/buttons/GetSor7edButton.tsx` — wa.me deep link builder
- `components/SaveToPhoneButton.tsx` — smart button (wa.me for public, API for auth)
- `app/api/save-to-phone/route.ts` — authenticated push to user's WhatsApp

---

## Tool OS — Standard Results Page

Every tool outputs results using this standard layout. All tools follow the same structure so the suite feels like a product, not a set of random generators.

1. **Hero Result** — the main number, score, or recommendation
2. **Breakdown** — where the result came from (transparent logic + category splits; the trust layer)
3. **Action Plan** — next 24 hours + next 7 days. Small. Doable.
4. **Artifacts** — scripts, checklists, rules, mini-protocols (copy/paste ready)
5. **Save + Compare** — save this run, view history, compare to previous runs
6. **Rerun loop** — suggested cadence + one-click rerun

**Paid-tier features (consistent across all tools):**
- PDF exports (1–2 page clean deliverables)
- Saved run history (timestamped)
- Compare mode ("what changed since last time?")
- Full action plans (7-day + 30-day)
- Full scripts/templates packs
- Advanced variants (conservative/realistic/aggressive)

**Definition of Done — a tool cannot ship without:**
- A clear promise ("what you get in 2–5 minutes")
- Breakdown/trust layer
- Action plan (next 24h + 7 days)
- At least one take-home artifact (export/save)
- A rerun loop (ideally with compare)

---

## Featured Tools

| Tool | Keyword | Branch | Promise |
|------|---------|--------|---------|
| ADHD Tax Calculator | TAX | Spend Smart | "Find your ADHD Tax and get a 30-day plan to cut it. 3 minutes." |
| Financial Autopilot | AUTOPILOT | Spend Smart | "Set up your finances to run on autopilot in 15 minutes." |
| Decision Paralysis Solver | CLARITY | Keep Going | "Get unstuck in 5 minutes: decision + guardrails + next step." |
| Dopamine Menu Generator | DOPAMINE | Keep Going | "Build a personalised menu of activities by effort level." |
| Task Triage | TRIAGE | Keep Going | "Sort what's now, what's later, what to drop — in one go." |
| RSD Response Scripts | RSD | Be Connected | "Calm scripts for when your nervous system is on fire." |
| Sensory Audit | SENSORY | Feel Good | "Map your preferences and get a practical accommodation plan." |
| Burnout Assessment | BURNOUT | Feel Good | "Identify your stage and get an immediate recovery protocol." |

---

## Monetization

**Principle: Don't paywall the basic answer. Free = insight. Paid = deliverable + continuity.**

### Free Tier (always)
- Run all tools + view headline result + basic breakdown
- Read all articles
- GET IT SOR7ED button (SAVE is unlimited; 5 free RUN commands via WhatsApp)
- No exports, no history, no compare

### Plus — Founding Member (£5.99/month or £49/year)
- Save run history + compare mode
- PDF exports (deliverables)
- Full 7-day + 30-day action plans
- Full scripts and templates packs
- Advanced variants
- Unlimited WhatsApp RUN commands
- Founding price — locked in while subscribed

### Supporter (£9.99–£12.99/month)
- Same features as Plus
- "Pay it forward" framing — subsidises scholarships

### Scholarships / Pay What You Can
- £0–£2/month, trust-based, no proof needed

---

## Technical Stack
- **Framework:** Next.js App Router v16.2.6
- **Auth & Database:** Supabase (magic link auth only — no passwords, PostgreSQL DB, Storage)
- **CMS:** Notion API (`2022-06-28`)
- **Hosting:** Vercel (with Vercel Cron)
- **Languages:** TypeScript, React 19, TailwindCSS
- **Messaging:** Meta WhatsApp Business API (via webhook)
- **Payments:** Stripe

**Auth note:** Magic link only — intentional. Passwords add friction for users with executive dysfunction. Users can also text `LOGIN` on WhatsApp to receive a magic link directly in their thread.

---

## Architecture Overview

```
Notion (CMS)
   ↓  every 5 min (Vercel Cron)
Supabase `protocols` table
   ↓  Next.js reads
Public website (articles + tools + results pages)
   ↓  GET IT SOR7ED button
wa.me link → WhatsApp → user sends command
   ↓
Meta WABA → /api/whatsapp/webhook → command parser → handler
   ↓
Bot reply: rich link card (sor7ed.com/r/[slug]) → redirect to page
```

### WhatsApp ↔ Web loop
Every WhatsApp reply deep-links to a specific web screen.
Every web screen has a GET IT SOR7ED button to continue in WhatsApp.

### Key directories
```
app/
  api/
    cron/
      sync-notion/        ← Notion → Supabase sync (every 5 min)
      weekly-broadcast/   ← Tuesday 10am opt-in broadcast
    whatsapp/webhook/     ← inbound handler (SAVE/RUN/ARTICLE/LIBRARY/LOGIN/STOP)
    save-to-phone/        ← authenticated push to user's WhatsApp
    account/delete/       ← GDPR account deletion
  intelligence/           ← public article pages
  tools/                  ← tool pages + result pages
  r/[slug]/               ← rich link redirect (OG metadata + redirect)
  s/[id]/                 ← save card URLs (OG metadata + redirect)
  dashboard/              ← member area (saved items, history, settings)
  signup/                 ← auth flow (magic link only, no passwords)
  privacy/, terms/, cookies/
components/
  SaveToPhoneButton.tsx       ← GET IT SOR7ED (wa.me for public, API for auth)
  buttons/GetSor7edButton.tsx ← wa.me deep link builder
  SmartNav.tsx                ← authenticated nav with user dropdown
  SiteFooter.tsx              ← footer with legal links
  DashboardClient.tsx         ← dashboard with Overview + Settings tabs
```

---

## Deployment & URLs
- **Production:** https://www.sor7ed.com
- **Canonical domain:** sor7ed.com (planetsorted.com 301-redirects here)
- **GitHub:** https://github.com/claudiokurath/sor7ed.git
- **Deploys:** Vercel auto-deploys on every push to `main`

---

## Database Schema

### `protocols` table (Supabase)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | unique, URL-safe |
| title | text | article title |
| branch | text | one of the 7 branches |
| status | text | `Published` / `Draft` |
| summary | text | short summary |
| excerpt | text | article intro |
| problem | text | full article body (markdown) |
| cta | text | call to action copy |
| protocol | text | the actual protocol (WhatsApp delivery) |
| keyword | text | WhatsApp trigger keyword |
| cover_image | text | URL — Supabase Storage or external |
| read_time | text | e.g. "3 min" |
| meta_description | text | SEO meta description |
| seo_title | text | SEO page title override |
| updated_at | timestamptz | set on upsert |

### `users` table
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK → auth.users |
| first_name | text | |
| email | text | |
| whatsapp_number | text | E.164 format |
| whatsapp_verified | boolean | verification flag |
| weekly_opted_in | boolean | weekly broadcast consent |
| whatsapp_opted_out | boolean | STOP unsubscribe flag |
| created_at | timestamptz | |

### `rich_links` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | unique, used in /r/[slug] URL |
| title | text | OG title |
| description | text | OG description |
| target_url | text | where to redirect after preview |
| image_url | text | OG image (1200×630) |
| created_at | timestamptz | |

### `rich_link_clicks` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| link_id | uuid | FK → rich_links |
| clicked_at | timestamptz | |
| user_agent | text | optional |

---

## Content Workflow

1. Author writes article in **Notion BLOG database** (`db668e4687ed455498357b8d11d2c714`)
2. Set `Status` = `Published` in Notion
3. Cron runs every 5 min → upserts row in Supabase `protocols` by `slug`
4. **Cover images**: if Notion file attachment → auto-downloaded and uploaded to Supabase Storage (`notion-files/covers/{slug}.jpg`). Subsequent syncs skip re-upload if file already exists.
5. Article appears on `/intelligence/{slug}` within 5 minutes
6. Article page shows GET IT SOR7ED button + end-of-article WhatsApp keyword block

### Notion DB required properties
| Notion Property | Maps to |
|----------------|---------|
| Title | `title` |
| Slug | `slug` |
| Branch | `branch` |
| Status | `status` |
| Summary | `summary` |
| Excerpt | `excerpt` |
| Blog Post | `problem` (article body) |
| CTA | `cta` |
| Protocol | `protocol` |
| WhatsApp Trigger | `keyword` |
| Cover Image 1 | `cover_image` |
| Read Time | `read_time` |
| Meta Description | `meta_description` |
| SEO Title | `seo_title` |

---

## WhatsApp Messaging
- **Inbound:** `POST /api/whatsapp/webhook` — parses `{ verb, arg }` → dispatches to handler
- **SAVE handler:** saves to `rich_links`, responds with `sor7ed.com/r/[slug]` rich card
- **RUN handler:** checks entitlements/metering → delivers tool URL as rich card, or paywall link
- **ARTICLE handler:** delivers article + protocol, with link back to web page
- **LOGIN handler:** generates magic link → sends to user's WhatsApp thread
- **Crisis detection:** intercepts crisis keywords → crisis-safe response before any other handler
- **STOP handling:** sets `whatsapp_opted_out = true`
- **STOPWEEKLY:** sets `weekly_opted_in = false` only
- **Weekly broadcasts:** opt-in only (`weekly_opted_in = true`), Tuesdays 10am via Vercel Cron
- **Rich previews:** every outbound URL uses `preview_url: true`; all bot URLs go via `/r/[slug]` or `/s/[id]` for consistent OG metadata
- **Compliance:** all messages logged

---

## Auth & Accounts
- **Magic link only — no passwords** (intentional: reduces friction for executive dysfunction)
- Supabase Auth (email magic link)
- WhatsApp `LOGIN` keyword → magic link sent directly to user's WhatsApp thread
- Dashboard at `/dashboard` — tabs: Overview (saved items, run history, compare), Settings
- Settings: name, email, WhatsApp number, weekly opt-in toggle, delete account
- Account deletion: wipes `user_favorites`, `assessment_history`, `saved_items`, `users` rows + deletes auth user. GDPR-compliant.
- SmartNav: shows user initial + first name when logged in; dropdown: Dashboard / Settings / Sign Out

---

## SEO Strategy
- **Brand challenge:** "SOR7ED" is not a natural search term; "sorted" is. Solution: target both.
- `Organization` + `WebSite` schema JSON-LD in `<head>` with `alternateName: ['sorted', 'Sorted', 'sor7ed']`
- Dynamic `sitemap.xml` (`/app/sitemap.ts`) — fetches live `Published` protocol slugs from Supabase
- `robots.txt` (`/app/robots.ts`) — allows all public content, blocks `/api/`, `/dashboard`, `/signup`
- `metadataBase` set to `NEXT_PUBLIC_SITE_URL` for correct OG/canonical URLs
- Per-article OG images + meta from `seo_title` / `meta_description` columns
- Logo alt text: "SOR7ED — practical protocols for neurodivergent minds"
- planetsorted.com: 301 permanent redirect → sor7ed.com (configured at DNS/Vercel level)

---

## Cron Jobs
| Schedule | Path | Purpose |
|----------|------|---------|
| `*/5 * * * *` | `/api/cron/sync-notion` | Notion → Supabase sync |
| `0 10 * * 2` | `/api/cron/weekly-broadcast` | Tuesday 10am opt-in WhatsApp broadcast |

Auth: `Authorization: Bearer ${CRON_SECRET}` header (Vercel sets this automatically for cron routes).

---

## Legal Pages
- `/privacy` — GDPR privacy policy (data collection, WhatsApp consent, Supabase storage, user rights)
- `/terms` — Terms of service (medical disclaimer: protocols are educational, not medical advice)
- `/cookies` — Cookie policy (essential session cookies only; no analytics/tracking/advertising cookies)
- All three linked in `SiteFooter` bottom bar
- No cookie consent banner needed — only strictly necessary cookies are used

---

## Environment Variables
| Variable | Used in |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (admin operations) |
| `NOTION_API_KEY` | Notion sync cron |
| `NOTION_BLOG_DB_ID` | Notion sync cron (`db668e4687ed455498357b8d11d2c714`) |
| `CRON_SECRET` | Cron route auth |
| `NEXT_PUBLIC_SITE_URL` | Metadata, sitemap, robots |
| `NEXT_PUBLIC_WA_NUMBER` | GET IT SOR7ED button (wa.me links) |
| `META_PHONE_NUMBER_ID` | WhatsApp send API |
| `META_WHATSAPP_TOKEN` | WhatsApp send API |
| `WHATSAPP_VERIFY_TOKEN` | WhatsApp webhook verification |
| `STRIPE_SECRET_KEY` | Payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook |

---

## Maintainer
- **Contact:** claudio@sor7ed.com

---

## Version
- **Current version:** 0.3.0

---

## Last Updated
- **Timestamp:** 2026-06-21 (WhatsApp-as-remote model, GET IT SOR7ED button, Tool OS, monetization, featured tools, rich link system, magic-link-only auth)

---

*This document is updated automatically after significant changes. It reflects the current live state of the SOR7ED platform.*
