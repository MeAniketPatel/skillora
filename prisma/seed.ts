/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { PrismaClient, Role, CourseStatus, PaymentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");
  
  // Clean up existing data in correct dependency order to prevent FK violations
  await db.certificate.deleteMany({});
  await db.purchase.deleteMany({});
  await db.lessonProgress.deleteMany({});
  await db.quizAttempt.deleteMany({});
  await db.quizQuestion.deleteMany({});
  await db.quiz.deleteMany({});
  await db.attachment.deleteMany({});
  await db.assignmentSubmission.deleteMany({});
  await db.note.deleteMany({});
  await db.answer.deleteMany({});
  await db.question.deleteMany({});
  await db.review.deleteMany({});
  await db.wishlist.deleteMany({});
  await db.enrollment.deleteMany({});
  await db.coupon.deleteMany({});
  await db.lesson.deleteMany({});
  await db.section.deleteMany({});
  await db.course.deleteMany({});
  
  // Auth & Session tables
  await db.account.deleteMany({});
  await db.session.deleteMany({});
  await db.authSession.deleteMany({});
  await db.authTokenBlacklist.deleteMany({});
  await db.passwordResetToken.deleteMany({});
  await db.authAuditLog.deleteMany({});
  await db.notification.deleteMany({});
  await db.contactMessage.deleteMany({});
  await db.platformSetting.deleteMany({});

  await db.user.deleteMany({});
  await db.category.deleteMany({});

  console.log("Database cleaned.");

  // 1. Seed Categories
  const categories = [
    { name: "Development", slug: "development" },
    { name: "Business", slug: "business" },
    { name: "Finance & Accounting", slug: "finance-accounting" },
    { name: "IT & Software", slug: "it-software" },
    { name: "Office Productivity", slug: "office-productivity" },
    { name: "Personal Development", slug: "personal-development" },
    { name: "Design", slug: "design" },
    { name: "Marketing", slug: "marketing" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Photography & Video", slug: "photography-video" },
    { name: "Health & Fitness", slug: "health-fitness" },
    { name: "Music", slug: "music" },
  ];

  console.log("Seeding categories...");
  const seededCategories: Record<string, any> = {};
  for (const cat of categories) {
    const record = await db.category.create({
      data: cat,
    });
    seededCategories[cat.slug] = record;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Seed Users
  console.log("Seeding users (Admin, Teachers, Students)...");
  
  const admin = await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@skillora.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const teacher1 = await db.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@skillora.com",
      password: hashedPassword,
      role: Role.TEACHER,
      bio: "Senior Software Engineer and Educator with 10+ years of experience in JavaScript, React, and Next.js.",
      headline: "Senior Software Engineer & Lead Instructor",
    },
  });

  const teacher2 = await db.user.create({
    data: {
      name: "John Smith",
      email: "john@skillora.com",
      password: hashedPassword,
      role: Role.TEACHER,
      bio: "Business consultant and author of several startup management books. Helping developers turn ideas into code and businesses.",
      headline: "Business Consultant & Educator",
    },
  });

  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await db.user.create({
      data: {
        name: `Student ${i}`,
        email: `student${i}@skillora.com`,
        password: hashedPassword,
        role: Role.STUDENT,
      },
    });
    students.push(student);
  }

  // 3. Seed Courses
  console.log("Seeding courses...");

  const course1 = await db.course.create({
    data: {
      title: "Next.js 16 Masterclass: Zero to Production",
      slug: "nextjs-16-masterclass-zero-to-production",
      description: "<p>Learn Next.js 16 from the ground up. Build real-world production projects with the App Router, Server Actions, middleware, and edge authentication.</p>",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
      price: 99.99,
      level: "INTERMEDIATE",
      language: "en",
      status: CourseStatus.PUBLISHED,
      teacherId: teacher1.id,
      categoryId: seededCategories["development"].id,
      publishedAt: new Date(),
    },
  });

  const course2 = await db.course.create({
    data: {
      title: "Intro to Financial Modeling & Startup Valuation",
      slug: "intro-to-financial-modeling-startup-valuation",
      description: "<p>Master the basics of business planning, financial projection spreadsheets, and startup funding valuations from experienced startup mentors.</p>",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      price: 49.99,
      level: "BEGINNER",
      language: "en",
      status: CourseStatus.PUBLISHED,
      teacherId: teacher2.id,
      categoryId: seededCategories["finance-accounting"].id,
      publishedAt: new Date(),
    },
  });

  const course3 = await db.course.create({
    data: {
      title: "Tailwind CSS v4 Deep Dive: Micro-animations and Gradients",
      slug: "tailwind-css-v4-deep-dive-micro-animations-and-gradients",
      description: "<p>A fast-paced guide to CSS styling using modern utility classes. Create sleek modern interfaces, responsive grids, dark modes, and dynamic hover styles.</p>",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
      price: 0.00, // Free
      level: "BEGINNER",
      language: "en",
      status: CourseStatus.PUBLISHED,
      teacherId: teacher1.id,
      categoryId: seededCategories["design"].id,
      publishedAt: new Date(),
    },
  });

  // 4. Seed Sections & Lessons
  console.log("Seeding course sections and lessons...");

  // Next.js sections
  const sec1 = await db.section.create({
    data: {
      title: "Getting Started with Next.js",
      position: 1,
      courseId: course1.id,
    },
  });

  const l1_1 = await db.lesson.create({
    data: {
      title: "Introduction & Setup",
      position: 1,
      sectionId: sec1.id,
      type: "VIDEO",
      videoUrl: "https://utfs.io/f/sample-video.mp4",
      content: "<p>Welcome to the Next.js 16 Masterclass. In this lesson, we will initialize our application structure.</p>",
      isPublished: true,
      isFree: true,
    },
  });

  const l1_2 = await db.lesson.create({
    data: {
      title: "Understanding Server Actions",
      position: 2,
      sectionId: sec1.id,
      type: "ARTICLE",
      content: "<p>Server actions allow you to execute database operations directly from components without REST APIs.</p>",
      isPublished: true,
    },
  });

  const sec2 = await db.section.create({
    data: {
      title: "Database Integration",
      position: 2,
      courseId: course1.id,
    },
  });

  const l1_3 = await db.lesson.create({
    data: {
      title: "Prisma & PostgreSQL Setup",
      position: 1,
      sectionId: sec2.id,
      type: "VIDEO",
      videoUrl: "https://utfs.io/f/sample-database.mp4",
      content: "<p>Learn how to connect Prisma ORM to a secure local or hosted PostgreSQL instance.</p>",
      isPublished: true,
    },
  });

  // Financial Modeling sections
  const sec3 = await db.section.create({
    data: {
      title: "Foundations of Financial Models",
      position: 1,
      courseId: course2.id,
    },
  });

  const l2_1 = await db.lesson.create({
    data: {
      title: "Income Statement vs Balance Sheet",
      position: 1,
      sectionId: sec3.id,
      type: "ARTICLE",
      content: "<p>Understand the basic financial statements required to evaluate any business model.</p>",
      isPublished: true,
      isFree: true,
    },
  });

  // Tailwind CSS sections
  const sec4 = await db.section.create({
    data: {
      title: "Introduction to Utility Styling",
      position: 1,
      courseId: course3.id,
    },
  });

  const l3_1 = await db.lesson.create({
    data: {
      title: "Creating a Responsive Navbar",
      position: 1,
      sectionId: sec4.id,
      type: "VIDEO",
      videoUrl: "https://utfs.io/f/sample-tailwind.mp4",
      content: "<p>Build a clean glassmorphic navbar using Tailwind's layout and border opacity classes.</p>",
      isPublished: true,
      isFree: true,
    },
  });

  // 5. Seed Quizzes
  console.log("Seeding quizzes...");
  const quiz = await db.quiz.create({
    data: {
      title: "Next.js Core Concepts Quiz",
      passingScore: 70,
      lessonId: l1_2.id,
    },
  });

  await db.quizQuestion.createMany({
    data: [
      {
        quizId: quiz.id,
        question: "What directive must be placed at the top of a file to declare a Client Component?",
        type: "MULTIPLE_CHOICE",
        options: [
          { text: '"use server"', isCorrect: false },
          { text: '"use client"', isCorrect: true },
          { text: '"use strict"', isCorrect: false },
          { text: '"use edge"', isCorrect: false }
        ] as any,
        explanation: "Next.js uses the 'use client' directive to mark components running on the browser side.",
        points: 1,
        position: 1,
      },
      {
        quizId: quiz.id,
        question: "Which file is used to define dynamic metadata or global headers in App Router layout?",
        type: "MULTIPLE_CHOICE",
        options: [
          { text: "layout.tsx", isCorrect: true },
          { text: "page.tsx", isCorrect: false },
          { text: "loading.tsx", isCorrect: false }
        ] as any,
        explanation: "Layout files define the shell layout and export custom metadata configurations.",
        points: 1,
        position: 2,
      }
    ],
  });

  // 6. Seed Enrollments & Purchases
  console.log("Seeding student enrollments, progress, and purchase metrics...");

  // Next.js course (99.99) - Student 1, 2, 3
  const nextEnrollments = [];
  const nextPurchases = [
    { student: students[0], amount: 99.99 },
    { student: students[1], amount: 99.99 },
    { student: students[2], amount: 99.99 }
  ];

  for (const item of nextPurchases) {
    const enrollment = await db.enrollment.create({
      data: {
        userId: item.student.id,
        courseId: course1.id,
        progress: 33, // Completed setup, skipped quiz/db
      },
    });

    nextEnrollments.push(enrollment);

    await db.purchase.create({
      data: {
        amount: item.amount,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: `pi_mock_${Math.random().toString(36).substring(7)}`,
        userId: item.student.id,
        enrollmentId: enrollment.id,
      },
    });

    // Seed progress for these students
    await db.lessonProgress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: l1_1.id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    await db.lessonProgress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: l1_2.id,
        isCompleted: false,
      },
    });

    await db.lessonProgress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: l1_3.id,
        isCompleted: false,
      },
    });
  }

  // Free Tailwind Course (0) - Student 4, 5
  for (const student of [students[3], students[4]]) {
    const enrollment = await db.enrollment.create({
      data: {
        userId: student.id,
        courseId: course3.id,
        progress: 100, // Fully completed
        completedAt: new Date(),
      },
    });

    await db.lessonProgress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: l3_1.id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Create a mock Certificate for Student 4
    if (student.id === students[3].id) {
      await db.certificate.create({
        data: {
          enrollmentId: enrollment.id,
          certificateId: `CERT-${Math.random().toString(36).substring(3, 8).toUpperCase()}`,
        },
      });
    }
  }

  // 7. Seed Reviews
  console.log("Seeding reviews...");
  await db.review.create({
    data: {
      rating: 5,
      comment: "Absolutely the best Next.js course ever! Detailed explanation of advanced concepts.",
      userId: students[0].id,
      courseId: course1.id,
    },
  });

  await db.review.create({
    data: {
      rating: 4,
      comment: "Very solid introduction. Highly recommended for beginners who want to build startups.",
      userId: students[1].id,
      courseId: course2.id,
    },
  });

  console.log("Database seeded successfully with rich sample dashboards data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
