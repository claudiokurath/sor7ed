# SOR7ED – Master Document

## 📋 Table of Contents
- [Executive Summary](#executive-summary)
- [Goals for this Build](#goals-for-this-build)
- [Product Definition](#product-definition)
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
- [Maintainer](#maintainer)
- [Version](#version)
- [Last Updated](#last-updated)

---

## Executive Summary
SOR7ED (pronounced "sorted") delivers practical protocols for neurodivergent adults across 7 branches of life via WhatsApp. Content is authored in Notion, synced to Supabase every 5 minutes, and surfaced on the website as public articles and private member protocols. Members trigger protocols by texting keywords to the SOR7ED WhatsApp number.

---

## Goals for this Build
- Fast, reliable website pulling content from Supabase (Notion → Supabase sync).
- WhatsApp delivery that feels instant, safe, and consistent.
- GDPR/PECR consent, crisis detection, STOP unsubscribes, opt-in weekly broadcasts.
- Clear free → paid conversion path (subscriptions and credit packs).
- SEO that surfaces "sorted" and neurodivergent search terms alongside "sor7ed".

---

## Product Definition
### What SOR7ED Is
- A content site (public) + member area (private).
- A WhatsApp-first delivery system for keyword-triggered templates.
- A Notion-powered CMS with Supabase as the live database.

### What SOR7ED Is **Not**
- Not therapy.
- Not medical advice.
- Not a crisis service.

### The 7 Branches
1. Keep Going (mental resilience)
2. Feel Good (body & wellbeing)
3. Spend Smart (money & executive function)
4. Be Connected (relationships)
5. Plan Ahead (organisation & time)
6. Be Yourself (identity & confidence)
7. Level Up (skills & growth)

---

## Technical Stack
- **Framework:** Next.js App Router v16.2.6
- **Auth & Database:** Supabase (Auth, PostgreSQL DB, Storage)
- **CMS:** Notion API (`2022-06-28`)
- **Hosting:** Vercel (with Vercel Cron)
- **Languages:** TypeScript, React 19, TailwindCSS
- **Messaging:** Meta WhatsApp Business API (via webhook)
- **Payments:** Stripe

---

## Architecture Overview

```
Notion (CMS)
   ↓  every 5 min (Vercel Cron)
Supabase `protocols` table
   ↓  Next.js reads
Public website (intelligence/ articles)
   ↓  signup
Supabase Auth + `users` table
   ↓  WhatsApp keyword
Meta WABA → /api/whatsapp/webhook → protocol lookup → WhatsApp reply
```

### Key directories
```
app/
  api/
    cron/
      sync-notion/   ← Notion → Supabase sync (every 5 min)
      weekly-broadcast/  ← Tuesday 10am opt-in broadcast
    whatsapp/webhook/  ← inbound WhatsApp handler
    account/delete/    ← GDPR account deletion
  intelligence/        ← public article pages
  dashboard/           ← member area
  signup/              ← auth flow
  privacy/, terms/     ← legal pages
components/
  SmartNav.tsx         ← authenticated nav with user dropdown
  SiteFooter.tsx       ← footer with legal links
  DashboardClient.tsx  ← full dashboard with Settings tab
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
| protocol | text | the actual protocol (WhatsApp only) |
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
| weekly_opted_in | boolean | weekly broadcast consent |
| whatsapp_opted_out | boolean | STOP unsubscribe flag |
| created_at | timestamptz | |

---

## Content Workflow

1. Author writes article in **Notion BLOG database** (`db668e4687ed455498357b8d11d2c714`)
2. Set `Status` = `Published` in Notion
3. Cron runs every 5 min → upserts row in Supabase `protocols` by `slug`
4. **Cover images**: if Notion file attachment → auto-downloaded and uploaded to Supabase Storage (`notion-files/covers/{slug}.jpg`). Subsequent syncs skip re-upload if file already exists.
5. Article appears on `/intelligence/{slug}` within 5 minutes

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
- Inbound: `POST /api/whatsapp/webhook` — fuzzy keyword matching → protocol lookup → reply
- Crisis detection: intercepts crisis keywords → crisis-safe response before protocol
- STOP handling: sets `whatsapp_opted_out = true` in `users` table
- Weekly broadcasts: opt-in only (`weekly_opted_in = true`), Tuesdays 10am via Vercel Cron
- STOPWEEKLY: unsubscribes from weekly only (leaves other messaging active)
- Compliance: all messages logged

---

## Auth & Accounts
- Supabase Auth (email + password)
- Dashboard at `/dashboard` — tabs: Overview, Settings
- Settings tab accessible via `?tab=settings` deep-link (used by SmartNav dropdown)
- Account deletion: wipes `user_favorites`, `assessment_history`, `saved_items`, `users` rows + deletes auth user. GDPR-compliant.
- SmartNav: shows user initial + first name when logged in; animated dropdown with Dashboard / Settings / Sign Out

---

## SEO Strategy
- **Brand challenge:** "SOR7ED" is not a natural search term; "sorted" is. Solution: target both.
- `Organization` schema JSON-LD in `<head>` with `alternateName: ['sorted', 'Sorted', 'sor7ed']`
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
- Linked in `SiteFooter` bottom bar

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
| `WHATSAPP_VERIFY_TOKEN` | WhatsApp webhook verification |
| `WHATSAPP_TOKEN` | WhatsApp send API |
| `STRIPE_SECRET_KEY` | Payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook |

---

## Maintainer
- **Contact:** claudio@sor7ed.com

---

## Version
- **Current version:** 0.2.0

---

## Last Updated
- **Timestamp:** 2026-05-17

---

*This document is updated automatically after significant changes. It reflects the current live state of the SOR7ED platform.*
