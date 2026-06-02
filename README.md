# Skillora

> **The modern e-learning platform where teachers create, students thrive..**

Skillora is a full-stack, production-grade e-learning platform built with modern web technologies. Teachers can create and sell courses with rich content (video, text, quizzes), and students can discover, enroll, learn, and earn certificates.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js v5 |
| **Payments** | Stripe (Checkout + Connect) |
| **File Storage** | UploadThing / S3 |
| **Email** | Resend |
| **Deployment** | Vercel |

## Features

### For Teachers
- Course creation with rich text editor
- Video lesson uploads with streaming
- Quiz and assessment builder
- Student management & analytics
- Revenue dashboard & payouts

### For Students
- Course discovery with search & filters
- Video player with progress tracking
- Quiz taking with instant grading
- Certificates on completion
- Personal notes & bookmarks

### Platform
- Role-based access (Student / Teacher / Admin)
- Stripe payments with teacher payouts
- SEO-optimized public pages
- Dark/light theme
- Fully responsive (mobile-first)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Docker)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/skillora.git
cd skillora

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/              # Next.js App Router (pages & layouts)
├── components/       # Reusable UI components
│   ├── ui/           # Primitive components (shadcn/ui)
│   ├── layout/       # Layout components (navbar, sidebar, footer)
│   └── shared/       # Shared business components
├── lib/              # Utility functions & configurations
├── actions/          # Server Actions (data mutations)
├── hooks/            # Custom React hooks
├── stores/           # Zustand state stores
├── types/            # TypeScript type definitions
└── config/           # App configuration
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

MIT
