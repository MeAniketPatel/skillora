# Skillora Feature Registry

> Source of truth for feature ownership, descriptions, and dependency scopes.
> Maintained alongside `src/features/<feature>/` directories.

## Tier 1 — Foundation

### `shared/`
- **Purpose:** Cross-cutting infrastructure. Prisma singleton, Stripe, Resend, UploadThing, shadcn UI primitives, global hooks, observability, event bus, cache, jobs.
- **Imports:** Nothing from `features/` or `core/`.

### `core/`
- **Purpose:** Cross-domain foundational entities (`User`, `Role`), value objects (`Money`, `Slug`, `Email`), and event envelopes.
- **Imports:** Nothing from `features/`.

### `features/auth/`
- **Purpose:** Authentication, registration, password reset, session management, user repository.
- **Owns:** `User` model interactions, NextAuth integration, security helpers.
- **Imports:** `shared/`, `core/`.

## Tier 2 — Domain Features

| Feature | Purpose | Imports from Tier 1 |
|---|---|---|
| `courses` | Course catalog, sections, lessons, quizzes, resources, peer review, live sessions | shared, core, auth |
| `students` | Bookmarks, streaks, learning goals, collections, notes, lesson progress | shared, core, auth, courses |
| `teachers` | Course management, payouts, course insights | shared, core, auth, courses |
| `payments` | Stripe integration, payment records | shared, core, auth, courses |
| `social` | Profile, follow, study groups, messages, activity | shared, core, auth, courses |
| `blog` | Blog posts (all roles can author) | shared, core, auth |
| `discussions` | Discussion threads, Q&A | shared, core, auth, courses |
| `flashcards` | Flashcard decks, review sessions | shared, core, auth, courses |
| `learning-paths` | Curated learning paths | shared, core, auth, courses |
| `cart` | Shopping cart (Zustand store) | shared, core, auth, courses |
| `referrals` | Referral program, points | shared, core, auth |
| `ai` | AI tutor (Gemini integration) | shared, core, auth |
| `enrollment` | Course enrollments, lesson completion | shared, core, auth, courses |
| `certificates` | Certificate generation, verification | shared, core, auth, courses, enrollment |
| `skill-gap` | Skill gap analysis, career recommendations | shared, core, auth, courses |
| `notifications` | User notifications | shared, core, auth |
| `categories` | Course categories | shared, core |
| `feature-flags` | Platform feature flags | shared, core, auth |
| `moderation` | Content moderation queue (Tier 2 dep) | shared, core, auth, courses, social |
| `announcements` | Platform/teacher announcements | shared, core, auth |
| `assignments` | Course assignments | shared, core, auth, courses |
| `attachments` | File attachments | shared, core |
| `contact` | Contact form submissions | shared, core |
| `email-preferences` | User email preferences | shared, core, auth |
| `gamification` | XP, badges, leaderboards | shared, core, auth |
| `gift-cards` | Gift card purchases/redemption | shared, core, auth, payments |
| `polls` | Course polls | shared, core, auth, courses |
| `reviews` | Course reviews | shared, core, auth, courses |
| `settings` | User settings | shared, core, auth |
| `subscriptions` | Subscription plans | shared, core, auth, payments |
| `webhooks` | Inbound webhooks (Stripe, etc.) | shared, core |
| `wishlist` | User wishlist | shared, core, auth, courses |
| `bundles` | Course bundles | shared, core, auth, courses |
| `search` | Global search | shared, core, auth, courses |

## Tier 3 — Orchestration

### `features/admin/`
- **Purpose:** Platform administration (users, courses, revenue, audit, coupons, moderation queue, feature flags, contact messages, reports, settings).
- **Imports:** `shared/`, `core/`, `auth/`, and **all Tier 2 features via barrels**.
- **Constraint:** Admin owns orchestration only. Business rules must live in the relevant Tier 2 feature.

## Notes

- All features expose a public API via `src/features/<feature>/index.ts`.
- Cross-feature imports resolve via the feature barrel only.
- The `Skill-Gap` and `AI` features are Tier 2 but depend on `courses` for recommendations.
- `search` is a Tier 2 feature that aggregates across many other features' data.

## Tier Dependency Rules

| Rule | Description |
|---|---|
| Tier 1 cannot import Tier 2 or Tier 3 | Foundation layers are pure. |
| Tier 2 can import Tier 1 and peer Tier 2 (via barrel only) | Domain features may reference each other's public APIs. |
| Tier 3 can import Tier 1 and Tier 2 | Admin orchestrates across domains. |
| No feature may import another feature's internals | All cross-feature access goes through `index.ts`. |
