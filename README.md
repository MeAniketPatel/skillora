# Skillora

A full-stack e-learning platform — teachers create courses, students take them. Built because I wanted to understand how platforms like Udemy/Coursera actually work under the hood.

## Tech

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js v5 (credentials + Google + GitHub)
- **Payments:** Stripe (Checkout + Connect for teacher payouts)
- **File storage:** UploadThing
- **Email:** Resend
- **AI:** Gemini (course descriptions, quiz generation)
- **State:** Zustand
- **Testing:** Vitest
- **Deployment:** Vercel

## What it does

**Teachers** can create courses with video lessons, quizzes, assignments, and rich text content. There's an analytics dashboard, student management, and payout tracking.

**Students** can browse/search courses, enroll, track progress, take quizzes, earn certificates, bookmark lessons, take notes, and leave reviews.

**Platform** has role-based access (student/teacher/admin), Stripe payment processing, dark/light theme, and full responsive design.

The thing I spent the most time on was the course editor — syncing state between the curriculum builder, lesson editor, and quiz builder while keeping everything debounced and performant was a headache.

## Running it

```bash
git clone https://github.com/YOUR_USERNAME/skillora.git
cd skillora
npm install
cp .env.example .env.local   # fill in your keys
npm run db:push
npm run dev
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |
| `npm run test` | Run tests |
| `npm run db:migrate` | Prisma migration |
| `npm run db:seed` | Seed sample data |

## Structure

```
src/
├── app/            # Next.js App Router pages & API routes
├── features/       # Feature modules (courses, auth, payments, etc.)
│   ├── actions/    # Server Actions
│   ├── components/ # React components
│   ├── contracts/  # Zod schemas
│   ├── permissions/# Access control
│   ├── repositories/# Data access (Prisma)
│   └── services/   # Business logic
├── shared/         # Shared UI, hooks, lib, types
└── core/           # Domain entities & events
```

## License

MIT
