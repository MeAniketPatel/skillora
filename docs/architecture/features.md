# Skillora Feature Registry

> Source of truth for feature ownership, descriptions, and dependency scopes.
> Maintained alongside `src/features/<feature>/` directories.
>
> **Last updated:** 2026-06-05 — after the 20-phase migration.

## Tier 1 — Foundation

### `shared/`
- **Purpose:** Cross-cutting infrastructure. Prisma singleton, Stripe, Resend, UploadThing, shadcn UI primitives, global hooks, observability, event bus, cache, jobs.
- **Imports:** Nothing from `features/` or `core/`.

### `core/`
- **Purpose:** Cross-domain foundational entities (`User`, `Role`), value objects (`Money`, `Slug`, `Email`), and event envelopes.
- **Imports:** Nothing from `features/`.

### `features/auth/`
- **Purpose:** Authentication, registration, password reset, session management, user repository, Prisma enum re-exports.
- **Owns:** `User` model interactions, NextAuth integration, security helpers, `AuthAuditAction` / `AuthSessionRevocationReason` enum re-exports.
- **Imports:** `shared/`, `core/`.

## Tier 2 — Domain Features

| Feature | Purpose | Imports from Tier 1 |
|---|---|---|
| `courses` | Course catalog, sections, lessons, quizzes, resources, peer review, live sessions | shared, core, auth |
| `students` | Bookmarks, streaks, learning goals, collections, notes, lesson progress | shared, core, auth, courses |
| `teachers` | Course management, payouts, course insights, analytics, announcements | shared, core, auth, courses |
| `payments` | Stripe integration, payment records | shared, core, auth, courses |
| `social` | Profile, follow, study groups, messages, activity | shared, core, auth |
| `blog` | Blog posts (all roles can author) | shared, core, auth |
| `discussions` | Course discussions and Q&A | shared, core, auth, courses |
| `notifications` | In-app notification feed | shared, core, auth |
| `enrollment` | Course enrollments and progress | shared, core, auth, courses |
| `certificates` | Course completion certificates | shared, core, auth, courses, enrollment |
| `wishlist` | Student course wishlist | shared, core, auth, courses |
| `reviews` | Course reviews and ratings | shared, core, auth, courses |
| `flashcards` | Spaced-repetition decks | shared, core, auth, courses |
| `subscriptions` | Subscription plans and billing | shared, core, auth |
| `referrals` | Referral program tracking | shared, core, auth |
| `learning-paths` | Curated multi-course paths | shared, core, auth, courses |
| `gamification` | XP, badges, leaderboards | shared, core, auth |
| `bundles` | Course bundles | shared, core, auth, courses |
| `polls` | Course polls | shared, core, auth, courses |
| `announcements` | Course and platform announcements | shared, core, auth |
| `assignments` | Course assignments and submissions | shared, core, auth, courses |
| `categories` | Course categories | shared, core |
| `email-preferences` | Per-user email opt-in settings | shared, core, auth |
| `gift-cards` | Gift card purchase and redemption | shared, core, auth, payments |
| `feature-flags` | Admin-controlled feature toggles | shared, core, auth |
| `skill-gap` | Skill gap analysis and recommendations | shared, core, auth, courses |
| `search` | Global search | shared, core |
| `settings` | Account settings (security, privacy, notifications) | shared, core, auth |
| `contact` | Public contact form and admin inbox | shared, core |
| `admin` | Admin moderation, coupons, audit logs | shared, core, auth |

## Tier 3 — Presentation Features (UI-only)

These features carry no data of their own; they compose state from Tier 2 features.

| Feature | Purpose | Imports from Tier 1+2 |
|---|---|---|
| `cart` | Shopping cart UI | shared, core, courses, payments |
| `chat` | Direct-message UI | shared, core, social, auth |
| `code-playground` | In-browser code editor | shared, core |
| `learn` | Lesson player shell, AI tutor panel | shared, core, courses, enrollment, students |
| `marketing` | Public-facing landing-page sections | shared, core |
| `study-groups` | Group page UI | shared, core, social |

## Conventions

Every feature under `src/features/<feature>/` follows the same layout:

```
<feature>/
├── components/      # React components
├── repositories/    # Data access (Prisma queries only)
├── services/        # Business logic, transactions, event emission
├── permissions/     # Role-based access maps and guards
├── contracts/       # Zod schemas for input validation
├── hooks/           # React hooks (useList, useDetail, useCreate, useUpdate, useDelete)
└── index.ts         # Public barrel — the only import target
```

### Dependency rules

- A feature may import from `shared/`, `core/`, and any Tier 1+2 feature above it.
- Tier 3 features may compose any Tier 2 feature.
- The only import target between features is the barrel `@/features/<feature>`.
- ESLint enforces this with `no-restricted-imports` patterns in `eslint.config.mjs`.
- The architecture fitness function in `scripts/check-architecture.sh` runs `madge`, the Prisma isolation check, and the legacy `@/data` check on every CI run.

### Service layer

Each feature exposes a `service` object via its barrel. Services:
- wrap repository calls with business logic (ADR-002);
- own transactions (ADR-006);
- emit domain events on the shared `eventBus` for mutations (ADR-003);
- accept the repository as a default parameter for DI in tests (ADR-007).

### Permissions

Each feature exposes a `can<Feature>` access map and an `assert<Feature>Access(role, action)` helper. Public access is tagged with the `"PUBLIC"` sentinel (ADR-005).

### Event bus

`src/shared/events/event-bus.ts` exports a synchronous in-process bus. Mutation methods on every service emit a domain event named `<feature>.<mutation>`. The bus auto-warns when a single event exceeds 500 ms or 5 listeners (ADR-008).
