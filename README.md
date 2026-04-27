# LinkNG

**LinkNG** is a mobile-first link-in-bio web app built specifically for Nigerian content creators. It's a locally-focused alternative to Linktree/Beacons — with Naira pricing, Paystack payments, Nigerian phone OTP, and analytics that understand Nigerian audience patterns.

## Features

- **Custom profile page** — claim a unique URL (`yourdomain.com/username`), upload a photo, write a bio, pick from 10 themes
- **Link management** — add, toggle, reorder (drag-and-drop), and delete links; quick-add for Instagram, TikTok, YouTube, Twitter/X, Spotify
- **Nigerian payment blocks** — Paystack, Selar, WhatsApp, bank account display (NUBAN), Opay, PalmPay
- **Analytics** — page views, per-link clicks, traffic sources, device breakdown, time-of-day heatmap
- **Auth** — email/password, Google OAuth, Nigerian phone OTP (via Termii)
- **Pricing in NGN** — Free (₦0), Creator (₦2,500/mo), Pro (₦6,000/mo)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (Auth.js) |
| Payments | Paystack |
| SMS OTP | Termii |
| Drag & Drop | @dnd-kit |
| Forms | react-hook-form + zod |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Paystack account
- Termii account (for SMS OTP)
- Google OAuth credentials (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/owolabiopeyemih-lgtm/My-first-link-project.git
cd My-first-link-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Push database schema
npm run db:push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_PLAN_CREATOR_MONTHLY=
PAYSTACK_PLAN_PRO_MONTHLY=
TERMII_API_KEY=
TERMII_SENDER_ID=
NEXT_PUBLIC_APP_NAME=LinkNG
```

See `.env.example` for the full list.

## Available Scripts

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Prisma generate (run after schema changes)
npm run db:push      # Push schema to DB (dev only, no migration file)
npm run db:migrate   # Create + apply a named migration
npm run db:studio    # Open Prisma Studio GUI
```

## Project Structure

```
app/
  (auth)/         # /login, /signup — public only
  (dashboard)/    # /dashboard/** — auth required
  [username]/     # Public SSR profile pages
  api/            # API routes
components/       # Shared React components
lib/              # Auth, Paystack, Termii, analytics, utils
prisma/           # Database schema + migrations
types/            # Shared TypeScript types
```

## Deployment

This project is optimized for deployment on **Vercel**.

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy — Vercel auto-detects Next.js

> **Note:** You'll need a hosted PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Railway) for production.

## License

MIT
