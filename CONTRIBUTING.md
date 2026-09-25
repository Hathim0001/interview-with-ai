# Contributing to Prept

Thank you for investing your time in contributing to Prept! Every improvement, big or small, helps us build a better mock interview experience for candidates and interviewers alike.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Reporting Bugs](#reporting-bugs)
3. [Requesting Features](#requesting-features)
4. [Branch Naming](#branch-naming)
5. [Commit Message Convention](#commit-message-convention)
6. [Pull Request Workflow](#pull-request-workflow)
7. [Local Development Setup](#local-development-setup)
8. [Code Style](#code-style)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code. Please report unacceptable behaviour to the maintainers via email (see [SECURITY.md](./SECURITY.md)).

---

## Reporting Bugs

Before opening a bug report, please search [existing issues](https://github.com/Hathim0001/interview-with-ai/issues) to avoid duplicates.

When you open a new issue, include:

- **Summary** — one-sentence description of the problem
- **Steps to reproduce** — numbered, minimal reproduction steps
- **Expected behaviour** — what should happen
- **Actual behaviour** — what actually happens (paste error messages / screenshots)
- **Environment** — OS, Node.js version, browser, relevant env variable names (not values)

---

## Requesting Features

Open an issue with the `enhancement` label. Describe:

- The problem you are trying to solve
- Your proposed solution (if any)
- Any alternatives you have considered

Maintainers triage feature requests weekly and tag accepted ones with `accepted`.

---

## Branch Naming

Use one of the following prefixes, followed by a short kebab-case description:

| Prefix | Use case |
|--------|----------|
| `feat/` | New feature or enhancement |
| `fix/` | Bug fix |
| `chore/` | Build, CI, dependency, or tooling changes |
| `docs/` | Documentation only |
| `refactor/` | Code restructure with no behaviour change |
| `test/` | Adding or improving tests |

**Examples**

```
feat/ai-feedback-email
fix/booking-slot-overlap
docs/api-reference
chore/upgrade-prisma-7
```

---

## Commit Message Convention

Prept follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature visible to users |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Maintenance (deps, CI, build) |
| `revert` | Reverts a previous commit |

### Examples

```
feat(booking): add conflict detection before slot reservation
fix(webhook): handle empty transcript gracefully
docs: update README with Vercel deployment steps
chore: upgrade @stream-io/node-sdk to 0.7.44
```

**Breaking changes** must include `BREAKING CHANGE:` in the footer:

```
feat(auth)!: replace custom JWT with Clerk session tokens

BREAKING CHANGE: existing session cookies are invalidated.
```

---

## Pull Request Workflow

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/interview-with-ai.git
   cd interview-with-ai
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/Hathim0001/interview-with-ai.git
   ```
4. **Create your branch** from `master`:
   ```bash
   git checkout -b feat/my-feature
   ```
5. **Make changes** — keep commits small and focused; one logical change per commit.
6. **Lint your code:**
   ```bash
   npm run lint
   ```
7. **Push** to your fork:
   ```bash
   git push origin feat/my-feature
   ```
8. **Open a Pull Request** against `Hathim0001/interview-with-ai:master`.
   - Fill in the PR template (description, type of change, testing notes, screenshots if applicable).
   - Link any related issues with `Closes #<issue>`.

### Review process

- At least one maintainer approval is required before merge.
- Maintainers may request changes; address them with follow-up commits on the same branch.
- Once approved, the PR is squash-merged into `master`.

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL (local instance or Supabase/Neon)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Copy the env template and fill in your values
cp .env.example .env.local

# 3. Run database migrations
npx prisma migrate dev

# 4. (Optional) Seed the database
npx prisma db seed

# 5. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Useful scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma's visual DB browser |
| `npx prisma migrate dev` | Apply pending migrations |

---

## Code Style

- **Formatting**: The project uses ESLint (`eslint-config-next`). Run `npm run lint` before committing.
- **Components**: React Server Components by default; add `"use client"` only when browser APIs or hooks are needed.
- **Server Actions**: All mutations go in `actions/` with `"use server"` at the top.
- **Imports**: Use the `@/` alias (mapped to the project root) for all internal imports.
- **Naming**: PascalCase for components and types, camelCase for functions and variables, kebab-case for file names (excluding components).
