# MASTER — SOR7ED Build Doc (Website + WhatsApp + Paywall)

<aside>
🧠

**CURRENT MASTER — SOR7ED build source of truth.** This page consolidates the current product model, website-first Tool OS, WhatsApp remote system, paywall logic, architecture, roadmap, and implementation checklist.

</aside>

<aside>
📌

**How to use this doc:** This page answers “what are we building?” For repo/deployment decisions, use [SOR7ED MASTER DOC — Repo & Deployment (Current)](https://app.notion.com/p/SOR7ED-MASTER-DOC-Repo-Deployment-Current-76345b93e8d54c6eb8e6f1bc237f2990?pvs=21). Older strategy/code docs are now reference/archive material.

</aside>

---

## 1) Product definition

SOR7ED is a neurodivergent-first content + tools platform for adults who are overwhelmed by life admin, executive dysfunction, money leakage, decisions, routines, sensory load, communication, and “simple” tasks that are not simple.

**Current model:**

- **Website = discovery + reading + rich results + account/history**
- **WhatsApp = remote control + saved library + commands**
- **Notion = CMS / operating content layer**
- **Supabase = user state, history, credits, saved items**
- **Stripe = paid deliverables + continuity**

**Core promise:** Templates, not inspiration. Shame-free. Action-focused.

### 1.1 What SOR7ED is

- Practical tools and templates for neurodivergent adults.
- Plain-English protocols that turn chaos into a next step.
- Website-first tools that produce useful take-home artifacts.
- WhatsApp-controlled access for people who do not want another app.

### 1.2 What SOR7ED is not

- Not therapy.
- Not medical advice.
- Not a crisis service.
- Not legal or financial advice.
- Not productivity shame.
- Not another app people have to remember to open.

### 1.3 Non-negotiables

- No passwords — magic link only.
- Every article/tool ends with a practical next step.
- Do **not** paywall the basic answer.
- Paywall deliverables, saved history, exports, full plans, comparison, and continuity.
- Keep core help accessible and shame-free.
- Do not sell user data.
- Do not use aggressive upselling.
- Do not make people feel broken for needing help.

---

## 2) Strategic direction

### 2.1 The pivot

**Original plan:** WhatsApp concierge service — “we do tasks for you.”

**Current plan:** Tools + content first, delivered through a website-first product with WhatsApp as the remote.

**Why this pivot works:**

1. **Lower risk** — no need to build complex human-fulfilment infrastructure first.
2. **Audience first** — build trust before asking for money.
3. **Content flywheel** — articles drive tools, tools drive saved results, saved results drive return usage.
4. **Proof of demand** — usage data shows what people actually need.
5. **Concierge later** — only add “do this for me” once demand is obvious.

### 2.2 Long-game vision

SOR7ED can eventually become a full-stack support system for neurodivergent adults:

- Free articles and protocols for education.
- Free basic tools for immediate help.
- Paid tool outputs for deeper artifacts and continuity.
- Saved history and comparison for behaviour change.
- Community or partnerships later.
- Concierge/delegation layer only if demand justifies it.

The sequence is:

1. **Tools prove demand**
2. **Content builds authority**
3. **Audience trusts the system**
4. **Paid deliverables feel natural**
5. **Concierge becomes an optional extension, not the starting point**

---

## 3) Brand + tone

### 3.1 Tone rules

- Direct.
- Shame-free.
- Plain English.
- No fluff.
- No “just do it.”
- No inspiration porn.
- Competent colleague, not guru.
- Practical, warm, and specific.

### 3.2 Brand phrases

- “Templates, not inspiration.”
- “Worry less, live more.”
- “Built for ADHD brains.”
- “No app. No spam. Just what works.”
- “One clear next step.”

### 3.3 Global disclaimers

Use these across site footer, sensitive tool pages, WhatsApp HELP/MENU, and relevant outputs:

- SOR7ED provides educational information, templates, and practical tools.
- It is not medical, clinical, legal, or financial advice.
- It is not a substitute for professional support.
- It is not a crisis service.
- If someone is in immediate danger in the UK, call 999.
- If someone feels at risk of harming themselves, text SHOUT to 85258.
- GDPR: no selling/sharing user data; deletion on request.

---

## 4) The 7 Branches

Everything maps to one of 7 life areas:

- 🧠 **Keep Going** — executive function, routines, task initiation, persistence
- 💰 **Spend Smart** — bills, budgeting, subscriptions, ADHD tax, money systems
- 💪 **Feel Good** — burnout, meds, sleep, sensory needs, body maintenance
- 💻 **Plan Ahead** — systems, calendars, digital setup, admin scaffolding
- 🤝 **Be Connected** — relationships, scripts, boundaries, RSD, communication
- ✨ **Be Yourself** — masking, identity, unmasking, self-acceptance
- 🌱 **Level Up** — career, skills, growth without burnout

### 4.1 Old branch names

Older docs may use the previous naming system:

- Mind → Keep Going
- Wealth → Spend Smart
- Body → Feel Good
- Tech → Plan Ahead
- Connection → Be Connected
- Impression → Be Yourself
- Growth → Level Up

Use the newer branch names above in current website/product work.

---

## 5) Experience model: Website-first Tool OS

### 5.1 North Star

A tool is monetizable when it produces a **take-home outcome artifact**.

A good SOR7ED tool does not just “answer” something. It leaves the user with something they can save, reuse, export, compare, or act on.

### 5.2 Standard results page modules

Default order:

1. **Hero Result** — main number, score, recommendation, diagnosis, or summary.
2. **Breakdown / trust layer** — transparent logic and assumptions.
3. **Action Plan** — next 24h + next 7 days, optionally 30 days.
4. **Artifacts** — rules, scripts, checklists, briefs, worksheets.
5. **Save + Compare** — history and deltas.
6. **Rerun loop** — cadence and one-click rerun.

### 5.3 Paid-feeling features

Use these consistently across tools:

- PDF export.
- Saved runs.
- Timestamped history.
- Compare mode.
- Advanced variants.
- Full scripts/templates packs.
- Longer action plans.
- Reusable personal rules.

---

## 6) Monetization + paywall rules

### 6.1 Principle

**Free = insight. Paid = deliverable + continuity.**

Do not paywall basic clarity.

### 6.2 Free tier

Free users can:

- Read content.
- Run tools.
- Get the headline result.
- Get basic breakdown.
- Use enough value to trust the product.

Free users do not get:

- Full exports.
- Full saved history.
- Compare mode.
- Full 7-day / 30-day plans.
- Advanced variants.
- Complete scripts/templates packs.

### 6.3 Plus tier

**Plus / Founding Member:** £5.99/mo or £49/yr.

Includes:

- Save runs + history.
- Compare mode.
- PDF exports.
- Full action plans.
- Full scripts/templates packs.
- Advanced variants.
- More or unlimited RUN executions, depending on final metering policy.

### 6.4 Supporter tier

Optional: £9.99–£12.99/mo.

Same features as Plus, framed as “pay it forward” to subsidise access for others.

### 6.5 Scholarships / pay-what-you-can

Trust-based £0–£2/mo option for affordability.

### 6.6 WhatsApp metering

- Meter **RUN** executions.
- Keep **SAVE** free.
- Example default: 5 free RUNs, then paywall.
- Blog/article delivery should remain free unless later strategy changes.

---

## 7) WhatsApp as the remote

### 7.1 Core concept

SOR7ED turns WhatsApp into a lightweight personal life-management remote.

The website is where the value is produced. WhatsApp is how users launch, save, retrieve, rerun, and remember.

### 7.2 Core loop

1. User finds article/tool on website.
2. User taps **GET IT SOR7ED**.
3. WhatsApp opens with pre-filled command.
4. User sends command.
5. Bot replies with rich preview card, link, or saved result.
6. User can return later using WhatsApp commands.

### 7.3 Canonical commands

- `SAVE <slug-or-url>`
- `RUN <tool-slug>`
- `ARTICLE <slug>`
- `LIBRARY`
- `HELP`
- `MENU`
- `LOGIN`
- `STOP`

### 7.4 Optional convenience commands

- `TAX` → interpret as `RUN adhd-tax-calculator`
- `AUTOPILOT` → interpret as `RUN financial-autopilot`
- `CLARITY` → interpret as `RUN decision-paralysis-solver`
- `SHOW LAST TAX` → open last ADHD Tax result
- `COMPARE TAX` → open comparison page

### 7.5 Matching rules

- Prefer structured commands over fuzzy matching.
- Backwards compatibility is allowed: if a whole message equals a known keyword, treat it as a RUN or ARTICLE command depending on content type.
- Unknown input reply: “Reply `SAVE <tool>`, `RUN <tool>`, or `MENU`.”

### 7.6 Rich preview requirements

Non-negotiable:

- Always include `preview_url: true` when sending URLs through WhatsApp.
- OG images must be public.
- OG images should be 1200×630.
- Keep OG images ideally under 300KB.
- Cache-bust stale WhatsApp previews by versioning image filenames/URLs.

---

## 8) Web pages & routes

### 8.1 Public

- `/` Home
- `/start` Start Here / guided onboarding
- `/branches/[branchSlug]`
- `/blog`
- `/blog/[slug]`
- `/tools`
- `/tools/[slug]`
- `/pricing`
- `/about`
- `/contact`
- `/legal/privacy`
- `/legal/terms`

### 8.2 Account

- `/login`
- `/account`
- `/account/history`
- `/account/history/[runId]`
- `/account/settings`

### 8.3 Admin

- `/admin`
- `/admin/blog`
- `/admin/tools`
- `/admin/users`
- `/admin/events`

### 8.4 Save card route

- `/s/[id]`

Purpose:

- Serve reliable Open Graph tags.
- Generate WhatsApp-friendly previews.
- Redirect or wrap target URL.
- Support saved tool/blog/external items.

---

## 9) Technical architecture

### 9.1 Three-layer system

1. **WhatsApp Business API layer**
    - Receives inbound messages.
    - Sends replies, links, rich previews, buttons, and list messages.
2. **Backend logic engine**
    - Command parsing.
    - Keyword routing.
    - Auth/token generation.
    - Notion CMS retrieval.
    - User state.
    - Entitlements and metering.
3. **Web app dashboard**
    - Seven-branches navigation.
    - Tools library.
    - Account/history.
    - Saved items.
    - Global search later.

### 9.2 Current stack

- Next.js App Router
- React
- TypeScript
- Tailwind v4
- Supabase Postgres + magic link auth
- Notion API as CMS
- WhatsApp Cloud API or Twilio webhook layer
- Stripe
- Vercel

### 9.3 Five critical files / modules

1. `app/s/[id]/page.tsx`
    - Save Card route with reliable OG metadata.
2. `components/SaveToWhatsAppButton.tsx`
    - Builds `wa.me` links for SAVE/RUN/ARTICLE commands.
3. `api/whatsapp/webhook` or equivalent route handler
    - Receives inbound WhatsApp messages and dispatches commands.
4. `lib/notion.ts`
    - Resolves tools/blog slugs and metadata from Notion.
5. `lib/entitlements.ts`
    - Checks plan/credits and meters RUN usage.

### 9.4 Minimum Supabase data model

#### `users`

- `id`
- `created_at`
- `whatsapp_e164`
- `email`
- `status`
- `plan`

#### `saved_items`

- `id` / `short_id`
- `user_id` or `user_wa_id`
- `created_at`
- `type` = `tool` / `blog` / `external`
- `source_id`
- `source_url`
- `title`
- `description`
- `og_image_url`
- `target_url`

#### `tool_requests`

- `id`
- `created_at`
- `user_id`
- `keyword`
- `input_text`
- `channel`
- `status`

#### `tool_runs`

- `id`
- `created_at`
- `tool_request_id`
- `tool_slug`
- `model`
- `output_text`
- `success`
- `latency_ms`

#### `credits_ledger`

- `id`
- `created_at`
- `user_id`
- `delta`
- `reason`
- `source`

#### `entitlements`

- `id`
- `user_id`
- `plan`
- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `current_period_end`

### 9.5 Security baseline

- Turn on RLS for Supabase tables.
- Service role can read/write server-side only.
- Client access limited to authenticated user.
- Secrets live in Vercel environment variables.
- Never commit real secrets.
- Maintain `.env.example` with safe placeholders.

---

## 10) Priority tools

### 10.1 Tool #1 — ADHD Tax Calculator

- **Slug:** `adhd-tax-calculator`
- **Remote trigger:** `TAX`
- **Promise:** “In 3 minutes, find your ADHD Tax and get a 30-day plan to cut it.”

**Inputs:**

- Monthly late fees
- Weekly impulse buys
- Monthly unused subscriptions
- Monthly lost-item replacement
- Productivity loss %
- Monthly income
- Monthly missed opportunities

**Tool OS modules:**

1. Annual ADHD Tax — conservative / realistic / aggressive.
2. Leak Map — category breakdown + top 2 leaks.
3. Fast Wins — max 3 actions for next 7 days.
4. 30-day plan — Week 1–4 steps.
5. Artifact — “My ADHD-proof money rules.”
6. Save + history.
7. Compare deltas per category.
8. Monthly rerun cadence.

**Deliverable:** PDF: “My ADHD Tax Leak Map + 30-Day Plan.”

**Paywall split:**

- Free: headline + basic breakdown.
- Paid: full plan + rules artifact + export + history/compare.

---

### 10.2 Tool #2 — Financial Autopilot

- **Slug:** `financial-autopilot`
- **Remote trigger:** `AUTOPILOT`
- **Promise:** “Set up your finances to run on autopilot in 15 minutes.”

**Inputs:**

- Monthly income after tax
- Monthly expenses
- Current savings
- Total debt
- Years to retirement
- Risk tolerance
- Automate investments toggle

**Tool OS modules:**

1. Savings rate + monthly surplus + recommended split.
2. Transparent rule breakdown.
3. Transfer plan table.
4. Setup checklist.
5. Debt vs invest recommendation.
6. 12-month projection.
7. Save + history + compare.
8. Monthly rerun cadence.

**Deliverable:** PDF: “Financial Autopilot Setup Pack.”

**Paywall split:**

- Free: snapshot + high-level split.
- Paid: transfer plan + checklist + projection + export + history/compare.

---

### 10.3 Tool #3 — Decision Paralysis Solver

- **Slug:** `decision-paralysis-solver`
- **Remote trigger:** `CLARITY`
- **Promise:** “Get unstuck in 5 minutes: decision + guardrails + next step.”

**Inputs:**

- Risk tolerance
- Potential impact
- Information sufficiency
- Reversibility
- Number of viable alternatives
- Urgency

**Tool OS modules:**

1. Readiness score.
2. Ranked blockers.
3. One clear recommendation.
4. Filled Decision Brief.
5. Scripts pack.
6. Save + history + compare.
7. Rerun after missing info or deadline.

**Deliverable:** PDF: “Decision Brief.”

**Paywall split:**

- Free: score + top blocker.
- Paid: full brief + scripts + export + history/compare.

---

## 11) Engineering roadmap

### 11.1 Phase 1 — GET IT SOR7ED button + OG previews

- Add button component generating `wa.me/<number>?text=<encoded>`.
- Add OG metadata per tool/blog page.
- Implement bot handler for `RUN <slug>` returning tool URL.
- Ensure outbound messages with URLs use `preview_url: true`.

### 11.2 Phase 1B — Blog delivery via WhatsApp

- Use distinct verb: `ARTICLE <slug>`.
- Bot returns full article/protocol template.
- Split long messages into parts: 1/4, 2/4, etc.
- Keep article delivery free.

### 11.3 Phase 2 — Save Card URLs

- Create `saved_items` table.
- Create `/s/[id]` route.
- Generate OG tags from saved item.
- Redirect or wrap target.
- Implement idempotent `SAVE <slug>` behaviour.

### 11.4 Phase 3 — Metering + Stripe paywall

- Create `run_usage` or use `tool_runs` + entitlements.
- Meter RUN only.
- Send Stripe checkout link in WhatsApp when limit is reached.
- Stripe webhook updates entitlements.
- Account/history page shows plan and saved runs.

### 11.5 This week

- Ship GET IT SOR7ED button on tool + blog pages.
- Confirm rich previews end-to-end.
- Ensure `preview_url: true` everywhere.
- Implement RUN parsing + basic metering stub.

### 11.6 This month

- Implement `/s/[id]`.
- Implement `LIBRARY`.
- Implement idempotent SAVE.
- Decide monthly vs lifetime metering.
- Implement Stripe paywall path.

### 11.7 This quarter

- Add external URL save support.
- Add analytics on RUN/SAVE behaviour.
- Improve account/history dashboard.
- Test partner/embedded distribution once previews are stable.

---

## 12) Notion CMS rules

### 12.1 Current property naming notes

Older code/docs may refer to outdated property names. Current implementation should standardise around the latest database schema.

Known changes from older snippets:

- `WhatsApp Keyword` → `WhatsApp Trigger`
- `Excerpt` → `Template`
- `NOTION_API_KEY` → `NOTION_SECRET`
- `NOTION_BLOG_DB_ID` → `NOTION_ARTICLES_DB_ID`

### 12.2 CMS behaviour

- Notion stores article/tool metadata and template content.
- Website renders tools/blog content from Notion.
- WhatsApp bot resolves commands against Notion records.
- Schema changes must be reflected in code and documented here.

---

## 13) Repo + deployment

Repo/deployment decisions live in:

[SOR7ED MASTER DOC — Repo & Deployment (Current)](https://app.notion.com/p/SOR7ED-MASTER-DOC-Repo-Deployment-Current-76345b93e8d54c6eb8e6f1bc237f2990?pvs=21)

That page controls:

- Canonical production repo.
- Target consolidated repo.
- PR and merge rules.
- Vercel environments.
- Deployment checklist.
- Environment variable rules.

As of the current repo doc:

- Canonical production repo: `claudiokurath/planetsorted`
- Target planned repo: `claudiokurath/sor7ed`

Only change repo truth in the repo/deployment doc.

---

## 14) Company details

- Registered name: SOR7ED LIMITED
- Company number: 16398701
- Founded: 2025
- Location: London, UK
- WhatsApp: +44 7360 277713
- Email: [hello@sor7ed.com](mailto:hello@sor7ed.com)
- Website: [sor7ed.com](http://sor7ed.com)

---

## 15) Definition of Done

Do not ship a tool unless it has:

- Clear promise: “what you get in 2–5 minutes.”
- Inputs that feel manageable.
- Hero result.
- Breakdown/trust layer.
- Action plan.
- At least one take-home artifact.
- Save or export path.
- Rerun loop.
- WhatsApp trigger.
- Legal/safety copy where relevant.
- Basic analytics event.
- Mobile-friendly result page.
- Failure/empty-state handling.

---

## 16) Reference map

### Current master

- This page: current product/build source of truth.

### Current repo/deployment master

- [SOR7ED MASTER DOC — Repo & Deployment (Current)](https://app.notion.com/p/SOR7ED-MASTER-DOC-Repo-Deployment-Current-76345b93e8d54c6eb8e6f1bc237f2990?pvs=21)

### Reference / now consolidated

- [REFERENCE — WhatsApp + Save System Architecture](https://app.notion.com/p/REFERENCE-WhatsApp-Save-System-Architecture-a8982c33b8114bb7b322886611ae2a47?pvs=21)
- [REFERENCE — Website Code Archive / Implementation Snippets](https://app.notion.com/p/REFERENCE-Website-Code-Archive-Implementation-Snippets-9666e23130a7454897644aec28cc4213?pvs=21)

### Archive

- [ARCHIVE — Business Strategy v4 Feb 2026](https://app.notion.com/p/ARCHIVE-Business-Strategy-v4-Feb-2026-1be1a9a2b5c4498ba3efae54691e5d32?pvs=21)

---

## 17) Consolidation log

| Date | Change |
| --- | --- |
| 2026-06-30 | Consolidated current build strategy, WhatsApp architecture, business pivot, Tool OS, paywall logic, data model, roadmap, and references into this master doc. |