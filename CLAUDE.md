# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**LinkNG** — A link-in-bio web app for Nigerian content creators. Mobile-first, Paystack payments, Nigerian phone OTP (Termii), privacy-first analytics. Full PRD: `PRD.md`.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run lint         # eslint

npm run db:generate  # prisma generate (required after schema changes)
npm run db:push      # push schema to DB without migration file (dev only)
npm run db:migrate   # create + apply a named migration file
npm run db:studio    # Prisma Studio GUI
```

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **Prisma** + PostgreSQL
- **NextAuth v5** (Auth.js) — email/password, Google OAuth, phone OTP via Credentials provider
- **Paystack** — subscriptions + webhooks
- **Termii** — Nigerian SMS OTP (`channel: "dnd"` to reach DND-registered numbers)
- **@dnd-kit** — drag-and-drop link reordering
- **zod + react-hook-form** — all form validation

## Architecture

### Route groups

| Group | Path | Auth |
|---|---|---|
| `(auth)` | `/login`, `/signup` | public only (middleware redirects logged-in users away) |
| `(dashboard)` | `/dashboard/**` | required — checked in `app/(dashboard)/layout.tsx` via `auth()` |
| `[username]` | `/:username` | public SSR profile page |

### Middleware (`middleware.ts`)

Runs on all routes except `_next/static`, `_next/image`, `favicon.ico`, `api/auth`, `api/analytics`, and `api/payments`. Redirects unauthenticated users away from `/dashboard` and `/onboarding`, and logged-in users away from `/login` and `/signup`.

### Key files

- `lib/auth.ts` — NextAuth config. Phone OTP is a Credentials provider: it reads an `OtpCode` record (set by `POST /api/otp/send`), marks it used, then upserts the `User`. Session strategy is JWT; `session.user.id` is populated via the `jwt`/`session` callbacks.
- `lib/themes.ts` — 10 themes as typed `ThemeStyles` objects (inline `React.CSSProperties`). Both the dashboard picker and the public page renderer call `getThemeStyles(theme)`. To add a theme, add a key to the `Theme` enum in `schema.prisma` and a matching entry in `themes.ts`.
- `lib/analytics.ts` — `trackPageView(profileId)` and `trackLinkClick(linkId)` are called fire-and-forget (`void`). Visitor identity is `sha256(ip|ua|date)` truncated to 16 hex chars — no raw IP or UA stored. Nigerian state geo is noted as deferred (not yet implemented).
- `lib/paystack.ts` — thin fetch wrapper over Paystack REST API. Plan codes (`PAYSTACK_PLAN_CREATOR_MONTHLY`, `PAYSTACK_PLAN_PRO_MONTHLY`) come from env vars and are mapped to `Plan` enum values in the webhook handler.
- `lib/termii.ts` — sends OTP via Termii SMS. Expects phone in E.164 format; use `normalizeNigerianPhone()` from `lib/utils.ts` before calling.
- `lib/utils.ts` — `PLAN_LIMITS` (checked in `POST /api/links`), `normalizeNigerianPhone()`, `formatNGN(kobo)`, `buildWhatsAppUrl()`, `cn()`, `slugify()`.

### Data model

```
User ──1:1──▶ Profile ──1:N──▶ Link ──1:N──▶ LinkClick
  │                └──1:N──▶ PageView
  └──1:1──▶ Subscription
```

- `Link.type` enum: `CUSTOM | SOCIAL | PAYSTACK | SELAR | WHATSAPP | BANK_ACCOUNT | OPAY | PALMPAY`
- `BANK_ACCOUNT` links are display-only (no click/redirect); `url` may be empty string.
- `Link.metadata: Json?` stores type-specific fields — e.g. `{ bankName, accountNumber }` for `BANK_ACCOUNT`, pre-filled message for `WHATSAPP`.
- `Link.order` is a plain integer. Reordering via `PATCH /api/links` runs a Prisma `$transaction` that bulk-updates order values.

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/links` | POST | Create link (checks plan limit via `PLAN_LIMITS`) |
| `/api/links` | PATCH | Reorder links (bulk update `order` in a transaction) |
| `/api/links/[id]` | PATCH / DELETE | Update or delete a single link |
| `/api/otp/send` | POST | Generate 6-digit code, write `OtpCode`, send via Termii |
| `/api/payments/webhook` | POST | Paystack webhook — `subscription.create` upgrades plan, `subscription.disable` downgrades to FREE |
| `/api/analytics/click` | POST | Record a `LinkClick` (called from the public page client-side) |
| `/api/auth/[...nextauth]` | ALL | NextAuth handler |

### Plan enforcement

`PLAN_LIMITS` in `lib/utils.ts` defines `maxLinks` and `analyticsRetentionDays` per plan. Checked in `POST /api/links` — returns HTTP 403 with `"Link limit reached for your plan"` if exceeded. Subscription state is driven entirely by Paystack webhooks updating the `Subscription` table.

### Public page performance

`app/[username]/page.tsx` uses `export const dynamic = "force-dynamic"` (SSR on every request). The only DB call is a single `db.profile.findUnique` with `include: { links }`. `trackPageView` is fire-and-forget (`void`) — do not await it or add anything else to this render path.

## Environment variables

Copy `.env.example` → `.env.local`. Required:

```
DATABASE_URL
AUTH_SECRET
AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
PAYSTACK_SECRET_KEY / NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
PAYSTACK_PLAN_CREATOR_MONTHLY / PAYSTACK_PLAN_PRO_MONTHLY
TERMII_API_KEY / TERMII_SENDER_ID
NEXT_PUBLIC_APP_NAME
```
