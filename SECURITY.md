# Security Policy

## Supported Versions

The following versions of Prept currently receive security updates:

| Version | Supported |
|---------|-----------|
| 1.x (latest) | ✅ Yes |
| < 1.0 | ❌ No |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue to report a security vulnerability.** Public disclosure before a fix is available could put users at risk.

Instead, report vulnerabilities by emailing the maintainers directly:

**Email:** `security@prept.app` *(or the address listed in the repository's profile)*

Your report should include:

- A clear description of the vulnerability
- Affected component(s) and version(s)
- Steps to reproduce or proof-of-concept (PoC) code
- Potential impact (data exposure, privilege escalation, denial of service, etc.)
- Any suggested mitigations, if known

We aim to acknowledge all reports within **72 hours** and to publish a fix within **14 days** for critical issues. We will credit you in the release notes unless you prefer to remain anonymous.

---

## Security Measures Already in Place

Prept is built with defence in depth. The following controls are active in production:

### Rate Limiting & Bot Protection (Arcjet)

[Arcjet](https://arcjet.com) is integrated at the server-action level using a token-bucket rate limiter:

| Endpoint / Action | Limit |
|-------------------|-------|
| `bookSlot` (booking) | 5 requests · refill 2/hr per user |
| `requestWithdrawal` (payout) | 3 requests · refill 1/hr per user |

Requests that exceed the quota receive an error; the IP is not blocked globally, minimising false positives for legitimate users.

### Authentication (Clerk)

- All server actions call `currentUser()` from `@clerk/nextjs/server` and throw `Unauthorized` if the session is absent or invalid.
- Role checks (`INTERVIEWER` / `INTERVIEWEE`) are enforced in every action that is role-specific.
- The payout approval endpoint (`approvePayout`) additionally requires a server-side `ADMIN_PAYOUT_PASSWORD` environment variable.

### Transport Security

- The application is designed to run exclusively over HTTPS (enforced by Vercel/Cloudflare in production).
- All secrets are stored in environment variables, never in source code.

### Database

- Prisma uses parameterised queries; raw SQL is avoided throughout the codebase.
- Cascading deletes are configured where appropriate to prevent orphaned sensitive records.

### Webhook Integrity

The Stream webhook handler at `POST /api/webhooks/stream` processes only `call.transcription_ready` and `call.recording_ready` events, ignoring all others. Duplicate webhook delivery is handled with an idempotency guard (`upsert` with a no-op `update`).

### Dependency Hygiene

- Dependencies are pinned in `package-lock.json`.
- We recommend running `npm audit` regularly and opening a PR for any high/critical advisories.

---

## Scope

The following are **in scope** for vulnerability reports:

- Authentication and authorisation bypass
- SQL injection or NoSQL injection
- Server-Side Request Forgery (SSRF)
- Cross-Site Scripting (XSS) in server-rendered content
- Sensitive data exposure via API or logs
- Rate-limit bypass on booking or withdrawal endpoints

The following are **out of scope**:

- Denial-of-service attacks requiring significant resources
- Social engineering of team members
- Issues in third-party services (Clerk, Stream, Arcjet) — please report those directly to the respective vendor
- Bugs with no security impact
