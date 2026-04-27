# PRD: LinkNG

**One line:** A customizable link-in-bio landing page with built-for-Nigeria analytics and payment integrations.

---

## Problem Statement

Nigerian content creators are forced to use Linktree or Beacons — tools priced in USD, with no Naira payment support, no local payment blocks (Paystack, Opay, NUBAN), and analytics that ignore Nigerian audience patterns. The result: creators lose sales, can't pitch brands with local data, and pay forex fees for tools that weren't built for them.

---

## Target User Profile

- **Primary:** Nigerian creator with 5K–500K followers on Instagram, TikTok, or YouTube
- Uses an Android phone as their primary (often only) device
- Monetizes via brand deals, Selar, Paystack, or WhatsApp
- Posts in English; audience is 90%+ Nigeria-based
- Pain: one bio link slot, scattered payment channels, no data to show brands

---

## Core Features

### 1. Username & Profile Page

Creators claim a unique URL (`linkng.co/username`) and configure a public-facing page.

**User stories:**
- As a creator, I want to claim a username so I have a permanent shareable link.
- As a creator, I want to upload a profile photo and write a bio so visitors know who I am.
- As a creator, I want to choose from 10 themes (color + font combos) so my page matches my brand without needing a designer.
- As a creator, I want to preview my page exactly as visitors see it before publishing.

---

### 2. Link Management

Creators add, reorder, toggle, and delete links on their page.

**User stories:**
- As a creator, I want to add a link with a label and URL so my audience can navigate to my content.
- As a creator, I want to drag-and-drop links to reorder them so my most important links are at the top.
- As a creator, I want to toggle a link off without deleting it so I can hide seasonal content temporarily.
- As a creator, I want quick-add buttons for Instagram, TikTok, YouTube, Twitter/X, and Spotify so setup is fast.
- As a creator (free plan), I want to be clearly told when I hit 5 links so I understand the limit without confusion.

---

### 3. Nigerian Payment & Monetization Blocks

Dedicated link block types for Nigerian payment channels, not just generic URLs.

**User stories:**
- As a creator, I want to add a Paystack storefront block so fans can pay me directly from my page.
- As a creator, I want to add a WhatsApp chat link with a pre-filled message so fans reach me for orders in one tap.
- As a creator, I want to display my NUBAN bank account number so fans can do direct transfers.
- As a creator, I want to add an Opay or PalmPay username block for fans who use those wallets.
- As a creator, I want to add a Selar product link so I can sell digital products inline.

---

### 4. Analytics Dashboard

Privacy-safe, no-PII analytics visible only to the creator.

**User stories:**
- As a creator, I want to see total page views by day, week, and month so I know when my page is getting traffic.
- As a creator, I want to see click counts and click rate per link so I know which links perform.
- As a creator, I want to see where my traffic comes from (Instagram, TikTok, direct) so I know which platform drives my audience.
- As a creator, I want to see a Nigerian state-level map of my visitors so I know where my audience lives.
- As a creator, I want to see a time-of-day heatmap so I know the best time to post and drive traffic.
- As a creator, I want to see device breakdown (Android/iOS/desktop) so I can optimize my content format.

---

### 5. Auth & Account

**User stories:**
- As a new user, I want to sign up with email/password or Google so onboarding is fast.
- As a user, I want to verify my phone number via OTP SMS so my account is secured with a Nigerian number.
- As a user, I want to reset my password via email so I can recover access if locked out.

---

### 6. Subscription & Plan Enforcement

**Plans:**

| Plan | Price | Limits |
|---|---|---|
| Free | ₦0/mo | 5 links, basic themes, 30-day analytics |
| Creator | ₦2,500/mo | Unlimited links, all themes, 1-year analytics, custom domain |
| Pro | ₦6,000/mo | All Creator + tip button, paid content gate, exportable reports |

**User stories:**
- As a creator, I want to upgrade my plan via Paystack checkout so I can pay in Naira with my local card.
- As a creator on Free, I want to see a clear prompt to upgrade when I exceed limits so I understand what I'm missing.
- As a creator, I want my plan to downgrade automatically if I cancel so my data is preserved but features are gated.

---

## Out of Scope (v1.0)

These will not be built, considered, or partially implemented:

- Native mobile app (Android or iOS)
- Multi-language support (English only)
- Crypto payment links (no USDT, no web3)
- Email marketing or newsletter integration
- A/B testing for link variants
- Embedded media players (YouTube, Spotify) on the public page
- Scheduled link visibility (time-gated links)
- Team or collaborator access
- White-labeling or agency dashboard
- AI-generated copy
- Referral or affiliate program

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for public pages, file-based routing, good image optimization |
| Language | TypeScript | Type safety across DB, API, and UI |
| Styling | Tailwind CSS | Fast, mobile-first, no runtime CSS |
| Database | PostgreSQL via Prisma | Relational, strong ORM, good migration story |
| Auth | NextAuth v5 (Auth.js) | Email/password, Google OAuth, custom Credentials for phone OTP |
| Payments | Paystack | NGN-native, local card support, subscription webhooks |
| SMS OTP | Termii | Nigerian coverage, DND-channel support |
| Analytics | Self-hosted Umami (or custom event table) | No ad-blocker block, no PII, full data ownership |
| Image handling | Next.js `<Image>` + `sharp` | Automatic compression for unoptimized creator uploads |
| Hosting | Vercel (app) + Supabase or Railway (DB) | Fast global CDN, Nigeria-proximate edge |

**Non-negotiables:**
- Public `[username]` pages must SSR — no client-only render
- No dependency on services blocked or unreliable in Nigeria without a VPN
- All pricing in NGN; payments in Kobo via Paystack API

---

## Definition of Done

A feature is done when:

1. **Functional:** All user stories for the feature pass manual QA on Android Chrome (375px viewport) and desktop Chrome.
2. **Typed:** No TypeScript `any` types in new code; Prisma schema matches DB.
3. **Tested:** Critical paths (auth, link save, analytics write, Paystack webhook) have at least one integration test or Playwright test.
4. **Performance:** Public profile page Lighthouse score ≥ 85 on mobile; LCP < 2.5s on simulated 3G.
5. **Secure:** No exposed secrets; OTP codes expire in 10 min; analytics data contains zero PII.
6. **Deployed:** Feature is live on staging and reviewed by at least one person who isn't the author.
