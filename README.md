# Prept — AI-Powered Mock Interview Marketplace

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-planned-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)
![Stream](https://img.shields.io/badge/Stream-Video%2FChat-005FFF)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

> **Connect candidates with senior engineers for live, AI-evaluated mock interviews — anytime, anywhere.**

![App Screenshot](./public/hero.png)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [Environment Variables](#environment-variables)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Overview

**Prept** is a full-stack mock interview marketplace built on Next.js 16. It bridges the gap between aspiring software engineers and senior engineers from top-tier companies (Google, Amazon, Meta, Netflix, Microsoft, Atlassian, Uber) by enabling live, 1-on-1 video mock interviews that are automatically transcribed and evaluated by Google Gemini AI.

### Who is it for?

| Role | What they get |
|------|---------------|
| **Interviewee (Candidate)** | Browse verified interviewers, book a 1-hour slot using credits, attend an HD video session, and receive a structured AI feedback report immediately after. |
| **Interviewer (Senior Engineer)** | Set availability, conduct sessions at their own credit rate, and cash out earnings via a simple payout workflow. |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | [Next.js](https://nextjs.org) (App Router) | 16.1.6 |
| UI Library | [React](https://react.dev) | 19.2.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4 |
| Component Primitives | [Radix UI](https://radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) | latest |
| Animation | [Motion](https://motion.dev) | 12 |
| ORM | [Prisma](https://prisma.io) | 7.4 |
| Database | PostgreSQL (via `pg` adapter) | — |
| Authentication | [Clerk](https://clerk.com) | 6 |
| Video & Chat SDK | [Stream](https://getstream.io) Video + Chat | latest |
| AI | [Google Gemini](https://ai.google.dev) (`gemini-2.5-flash-lite`) | — |
| Email | [Resend](https://resend.com) + React Email | — |
| Security | [Arcjet](https://arcjet.com) (rate limiting, bot protection) | 1.3 |
| Toasts | [Sonner](https://sonner.emilkowal.ski) | 2 |
| Icons | [Lucide React](https://lucide.dev) | latest |

---

## Features

| | Feature | Description |
|---|---------|-------------|
| 🎥 | **HD Video Calls** | Stream Video SDK powers 1080p recorded sessions with screen sharing and auto-transcription |
| 🤖 | **AI Question Generator** | Interviewers get 6 Gemini-generated questions per interview category at the start of each call |
| 📊 | **AI Feedback Reports** | After every session, the transcript is sent to Gemini which produces a structured feedback report covering technical skills, communication, problem solving, strengths, improvements, and an overall rating |
| 💬 | **Persistent Chat Threads** | Stream Chat provides a text channel alongside every video call for sharing code snippets and links |
| 📅 | **Slot-based Scheduling** | Interviewers define a single rolling availability window; candidates see available 1-hour slots generated from it |
| 💳 | **Credit-based Subscriptions** | Three plans — Free (5 credits/mo), Starter ($29 · 30 credits/mo), Pro ($69 · 80 credits/mo) — with per-session credit deduction and interviewer earnings |
| 🔒 | **Bot Protection** | Arcjet shields booking and withdrawal endpoints with token-bucket rate limiting (5 bookings/hr, 3 withdrawals/hr) |
| 📧 | **Email Notifications** | Resend delivers HTML withdrawal-request emails to admins via React Email templates |

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **pnpm** (recommended) or npm / yarn
- **PostgreSQL** database (local or Supabase/Neon)

### 1. Clone the repository

```bash
git clone https://github.com/Hathim0001/interview-with-ai.git
cd interview-with-ai
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every variable (see [Environment Variables](#environment-variables)).

### 4. Run database migrations

```bash
npx prisma migrate dev
```

This creates all tables and runs the Prisma seed if present.

### 5. Start the development server

```bash
npm run dev
```

The app is available at **http://localhost:3000**.

---

## Project Structure

```
interview-with-ai/
├── actions/                  # Next.js Server Actions (business logic)
│   ├── aiQuestions.jsx       # Gemini question generation
│   ├── appointments.js       # Booking queries
│   ├── booking.js            # Slot booking + Stream call creation
│   ├── call.js               # Stream token generation
│   ├── dashboard.js          # Availability & withdrawal actions
│   ├── explore.js            # Interviewer listing
│   ├── onboarding.js         # Role assignment
│   ├── payout.js             # Admin payout approval
│   └── user.js               # Current user resolver
│
├── app/                      # Next.js App Router
│   ├── (auth)/               # Clerk sign-in / sign-up pages
│   ├── (main)/               # Authenticated app shell
│   │   ├── dashboard/        # Interviewer & interviewee dashboards
│   │   ├── explore/          # Browse interviewers
│   │   ├── interviewers/     # Interviewer profile + booking flow
│   │   ├── meeting/          # Live video call room
│   │   └── onboarding/       # First-time role selection
│   ├── api/
│   │   └── webhooks/stream/  # Stream event handler (transcription → AI feedback)
│   ├── layout.js             # Root layout with Clerk + theme providers
│   └── page.jsx              # Public landing page
│
├── components/
│   ├── landing/              # Landing page sections (Hero, Features, CTA …)
│   ├── ui/                   # shadcn/ui primitives
│   └── animate-ui/           # Motion-powered animated primitives
│
├── emails/
│   └── WithdrawalRequestEmail.jsx  # React Email template
│
├── hooks/                    # Custom React hooks
├── lib/
│   ├── arcjet.js             # Rate-limiter factory
│   ├── checkUser.js          # Clerk → DB user sync
│   ├── data.js               # Static reference data (plans, company logos…)
│   ├── helpers.js            # Slot generation utilities
│   ├── prisma.js             # Prisma singleton
│   └── utils.js              # Tailwind merge helper
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.js               # Optional seed script
│   └── migrations/           # Auto-generated SQL migrations
│
├── public/                   # Static assets (logos, hero images)
├── .env.example              # Environment variable template
├── next.config.mjs
└── package.json
```

---

## Database Schema

Prept uses **PostgreSQL** via Prisma 7. The schema has six core models:

| Model | Description |
|-------|-------------|
| `User` | Unified model for both interviewees (credits, plan) and interviewers (bio, credit rate, balance). Role is `UNASSIGNED → INTERVIEWEE \| INTERVIEWER` after onboarding. |
| `Availability` | A single rolling time window an interviewer has opened. Status: `AVAILABLE`, `BOOKED`, `BLOCKED`. Booked slots are computed from overlapping `Booking` rows. |
| `Booking` | Records a confirmed session: who, when, credit cost, `streamCallId`, optional recording URL, and status (`SCHEDULED → COMPLETED \| CANCELLED`). |
| `Feedback` | One-to-one with `Booking`. Stores the full Gemini-generated feedback (summary, technical, communication, problem solving, recommendation, strengths, improvements, overall rating). |
| `CreditTransaction` | Immutable ledger entry. Types: `CREDIT_PURCHASE`, `BOOKING_DEDUCTION`, `BOOKING_EARNING`, `ADMIN_ADJUSTMENT`. |
| `Payout` | A withdrawal request from an interviewer. Stores credits, platform fee (20 %), net amount, payment method/detail, and status (`PROCESSING → PROCESSED`). |

Interview categories supported: `FRONTEND`, `BACKEND`, `FULLSTACK`, `DSA`, `SYSTEM_DESIGN`, `BEHAVIORAL`, `DEVOPS`, `MOBILE`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the following:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe to expose to browser) |
| `CLERK_SECRET_KEY` | Clerk secret key (server-only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path (default: `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path (default: `/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in (default: `/onboarding`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up (default: `/onboarding`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream project API key (browser-safe) |
| `STREAM_SECRET_KEY` | Stream project secret (server-only) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `ARCJET_KEY` | Arcjet site key |
| `NEXT_PUBLIC_CLERK_BILLING_URL` | Clerk Billing portal URL (optional) |

See [`.env.example`](./.env.example) for the full commented template.

---

## Deployment

### Recommended stack

| Service | Purpose |
|---------|---------|
| [Vercel](https://vercel.com) | Next.js hosting (zero-config, Edge Functions) |
| [Supabase](https://supabase.com) or [Neon](https://neon.tech) | Managed PostgreSQL |
| [Clerk](https://clerk.com) | Auth — configure redirect URLs to your Vercel domain |
| [Stream](https://getstream.io) | Video & Chat — set webhook URL to `https://<your-domain>/api/webhooks/stream` |

### Steps

1. Push your repo to GitHub.
2. Import into Vercel and set all environment variables from the table above.
3. Set the **Stream webhook** to `POST https://<domain>/api/webhooks/stream` and subscribe to `call.transcription_ready` and `call.recording_ready` events.
4. Run `npx prisma migrate deploy` via Vercel's build command or a one-time terminal against your production database.

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. Quick summary:

1. **Fork** the repository and clone locally.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Make your changes and commit following [Conventional Commits](https://www.conventionalcommits.org).
4. Open a **Pull Request** against `main` and fill in the PR template.

Bug reports and feature requests go in [GitHub Issues](https://github.com/Hathim0001/interview-with-ai/issues).

---

## License

[MIT](./LICENSE) © 2026 Prept contributors
