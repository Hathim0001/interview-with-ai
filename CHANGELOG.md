# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- TypeScript migration (in progress)
- End-to-end tests with Playwright

### Changed
- Landing page decomposed into focused section components (`HeroSection`, `FeaturesSection`, `CTASection`, etc.)
- React Strict Mode enabled (`reactStrictMode: true`)
- Root layout SEO metadata improved

### Fixed
- Removed debug `console.log` from availability slot generator (`lib/helpers.js`)

---

## [1.0.0] — 2026-09-25

### Added

- **Initial release of Prept MVP** — AI-powered mock interview marketplace
- **HD video calls** via Stream Video SDK with 1080p recording, screen sharing, and auto-transcription
- **Credit-based subscription system** with three tiers:
  - Free — 5 credits/month
  - Starter — $29/month · 30 credits/month
  - Pro — $69/month · 80 credits/month
- **AI question generation** via Google Gemini (`gemini-2.5-flash-lite`) — 6 questions per interview category, with model answers
- **AI feedback reports** post-interview: Gemini analyses the full session transcript and produces a structured report covering technical skills, communication, problem solving, strengths, areas for improvement, hire recommendation, and overall rating
- **Persistent chat threads** via Stream Chat SDK — text channel alongside every video call
- **Slot-based scheduling system** — interviewers define a rolling availability window; 1-hour bookable slots are computed automatically
- **Bot protection** via Arcjet — token-bucket rate limiting on booking (5/hr) and withdrawal (3/hr) endpoints
- **Email notifications** via Resend — HTML withdrawal-request emails to admins using React Email templates
- **Payout system** for interviewers — 20 % platform fee, net amount calculation, admin approval flow
- **Onboarding flow** — role selection (Interviewee / Interviewer) with profile setup for interviewers (bio, title, company, years of experience, interview categories)
- **Stream webhook handler** (`POST /api/webhooks/stream`) — processes `call.transcription_ready` to generate AI feedback and `call.recording_ready` to persist recording URLs
- **Arcjet rate limiter factory** (`lib/arcjet.js`) — reusable `createRateLimiter` / `checkRateLimit` helpers
- **Prisma 7 schema** with six models: `User`, `Availability`, `Booking`, `Feedback`, `CreditTransaction`, `Payout`
- **PostgreSQL migrations** via Prisma Migrate
- **Clerk authentication** with Clerk-managed billing portal
- **Public landing page** with animated hero, bento features grid, logo marquee, roles section, and CTA
- **Environment variable template** (`.env.example`) with all required keys

---

[Unreleased]: https://github.com/Hathim0001/interview-with-ai/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Hathim0001/interview-with-ai/releases/tag/v1.0.0
