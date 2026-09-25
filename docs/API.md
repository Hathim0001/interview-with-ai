# Server Actions & API Reference

All business logic in Prept lives in **Next.js Server Actions** (`actions/`) and a single webhook API route. There is no separate REST or GraphQL API.

> [!NOTE]
> All server actions are `"use server"` functions. They run exclusively on the server, have direct database access via Prisma, and are called from Client or Server Components using standard `import`.

---

## Server Actions

### `actions/user.js`

#### `getCurrentUser()`

Returns the currently authenticated user's profile from the database.

```ts
getCurrentUser(): Promise<{
  role: UserRole;
  name: string | null;
  title: string | null;
  company: string | null;
  imageUrl: string | null;
} | null>
```

Used by: `components/header.jsx` to conditionally render nav links.

---

### `actions/onboarding.js`

#### `completeOnboarding(role, profileData?)`

Sets the user's role after first sign-in. For `INTERVIEWER` roles, also saves bio, title, company, years of experience, interview categories, and credit rate.

```ts
completeOnboarding(
  role: "INTERVIEWEE" | "INTERVIEWER",
  data?: {
    bio: string;
    title: string;
    company: string;
    yearsExp: number;
    categories: InterviewCategory[];
    creditRate: number;
  }
): Promise<{ success: boolean; role: UserRole }>
```

---

### `actions/explore.js`

#### `getInterviewers(category?)`

Returns a paginated list of verified interviewers, optionally filtered by `InterviewCategory`.

```ts
getInterviewers(
  category?: InterviewCategory | null
): Promise<InterviewerProfile[]>
```

---

### `actions/booking.js`

#### `createBooking(interviewerId, startTime, endTime)`

Atomically:
1. Verifies the interviewee has sufficient credits.
2. Creates a `Booking` record with `SCHEDULED` status.
3. Creates a Stream Video call and stores the `callId` on the booking.
4. Deducts credits from the interviewee (`BOOKING_DEDUCTION` transaction).

```ts
createBooking(
  interviewerId: string,
  startTime: Date,
  endTime: Date
): Promise<{ success: boolean; callId: string }>
```

Rate-limited by Arcjet: **5 bookings per hour** per IP.

---

### `actions/appointments.js`

#### `getAppointments()`

Returns all bookings for the currently authenticated user (as either interviewee or interviewer), ordered by `startTime` descending.

```ts
getAppointments(): Promise<BookingWithRelations[]>
```

---

### `actions/dashboard.js`

#### `getDashboardData()`

For **interviewers**: returns upcoming bookings, total earnings, credit balance, and current availability window.

#### `setAvailability(startTime, endTime)`

Creates or updates the interviewer's single rolling availability window.

#### `requestPayout(credits, paymentMethod, paymentDetail)`

Creates a `Payout` record in `PROCESSING` status and fires a Resend email to the admin.

Rate-limited by Arcjet: **3 withdrawal requests per hour** per IP.

---

### `actions/payout.js`

#### `processPayout(payoutId)`

Admin-only. Marks a payout as `PROCESSED`, sets `processedAt` and `processedBy`, and deducts the credits from the interviewer's `creditBalance`.

---

### `actions/call.js`

#### `generateStreamToken(callId)`

Generates a short-lived Stream Video token for the authenticated user to join the specified call.

```ts
generateStreamToken(callId: string): Promise<{ token: string }>
```

---

### `actions/aiQuestions.jsx`

#### `generateAIQuestions(role, level, categories)`

Calls `gemini-2.5-flash-lite` to generate 6 role-specific interview questions tailored to the candidate's seniority level and selected categories.

```ts
generateAIQuestions(
  role: string,
  level: string,
  categories: InterviewCategory[]
): Promise<{ questions: string[] }>
```

---

## Webhook API Routes

### `POST /api/webhooks/stream`

Receives Stream Video webhook events. Skips Arcjet protection (whitelisted in `middleware.js`).

**Handled events:**

| Event | Action |
|-------|--------|
| `call.transcription_ready` | Downloads the VTT transcript, sends it to Gemini, stores the returned `Feedback` record, and marks the `Booking` as `COMPLETED`. Also creates a `BOOKING_EARNING` `CreditTransaction` for the interviewer. |
| `call.recording_ready` | Stores the recording URL on the `Booking` record. |

**Security:** Validates the Stream webhook signature using `STREAM_SECRET_KEY` before processing any payload.
