# Architecture Overview

This document describes the high-level system design of **Prept**, an AI-powered mock interview marketplace built on Next.js 16.

---

## High-Level Architecture

```mermaid
flowchart TD
    Browser["Browser / Mobile"]
    NextApp["Next.js 16 App Router\n(Vercel Edge)"]
    Clerk["Clerk\nAuth & Billing"]
    DB["PostgreSQL\n(Supabase / Neon)"]
    Prisma["Prisma ORM"]
    Stream["Stream\nVideo + Chat SDK"]
    Gemini["Google Gemini AI\n(gemini-2.5-flash-lite)"]
    Resend["Resend\nTransactional Email"]
    Arcjet["Arcjet\nBot + Rate Limit"]

    Browser -->|"HTTPS requests"| NextApp
    NextApp -->|"auth()"| Clerk
    NextApp -->|"Server Actions / API Routes"| Prisma
    Prisma -->|"SQL"| DB
    NextApp -->|"generateToken / createCall"| Stream
    Stream -->|"Webhook: transcription_ready"| NextApp
    NextApp -->|"generateContent"| Gemini
    NextApp -->|"sendEmail"| Resend
    NextApp -->|"aj.protect()"| Arcjet
```

---

## Booking Data Flow

```mermaid
sequenceDiagram
    actor Candidate
    participant App as Next.js App
    participant DB as PostgreSQL
    participant Stream as Stream Video
    participant Gemini as Google Gemini
    participant Email as Resend

    Candidate->>App: Select slot on /interviewers/[id]
    App->>DB: Create Booking (SCHEDULED) + deduct credits
    App->>Stream: Create call (streamCallId stored on Booking)
    App-->>Candidate: Redirect to /call/[callId]

    note over Stream: Both users join call
    note over Stream: Call ends → transcription generated

    Stream->>App: POST /api/webhooks/stream (call.transcription_ready)
    App->>Gemini: Send transcript for structured feedback
    Gemini-->>App: JSON feedback object
    App->>DB: Create Feedback + mark Booking COMPLETED
    App->>DB: Create CreditTransaction (BOOKING_EARNING) for interviewer
```

---

## Payout Flow

```mermaid
sequenceDiagram
    actor Interviewer
    participant App as Next.js App
    participant DB as PostgreSQL
    participant Email as Resend

    Interviewer->>App: Submit payout request (credits, payment method)
    App->>DB: Create Payout (PROCESSING)
    App->>Email: Send withdrawal request email to admin
    note over Email: Admin reviews and approves
    App->>DB: Mark Payout PROCESSED + deduct creditBalance
```

---

## Database Entity Relationships

```mermaid
erDiagram
    User {
        string id PK
        string clerkUserId UK
        string email UK
        UserRole role
        int credits
        string currentPlan
        int creditBalance
    }

    Availability {
        string id PK
        string interviewerId FK
        datetime startTime
        datetime endTime
        AvailabilityStatus status
    }

    Booking {
        string id PK
        string intervieweeId FK
        string interviewerId FK
        datetime startTime
        datetime endTime
        BookingStatus status
        int creditsCharged
        string streamCallId UK
    }

    Feedback {
        string id PK
        string bookingId FK UK
        string summary
        FeedbackRating overallRating
    }

    CreditTransaction {
        string id PK
        string userId FK
        int amount
        TransactionType type
        string bookingId FK
    }

    Payout {
        string id PK
        string interviewerId FK
        int credits
        float netAmount
        PayoutStatus status
    }

    User ||--o{ Availability : "sets"
    User ||--o{ Booking : "books as interviewee"
    User ||--o{ Booking : "conducts as interviewer"
    Booking ||--o| Feedback : "generates"
    User ||--o{ CreditTransaction : "has"
    Booking ||--o{ CreditTransaction : "triggers"
    User ||--o{ Payout : "requests"
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js Server Actions** for all mutations | Removes the need for a separate API layer; type-safe, co-located with components |
| **Single `User` model** for both roles | Avoids join complexity; role-specific fields are simply `null` for the other role |
| **Stream for video + chat** | Managed WebRTC + persistent chat in one SDK; webhook delivers transcripts |
| **Credits as integers** in the DB | Avoids floating-point rounding errors for financial logic |
| **Arcjet at the middleware layer** | Protects all API routes without touching individual handlers |
| **Prisma 7 with `@prisma/adapter-pg`** | Native PostgreSQL driver for serverless environments (no connection pool bloat) |
