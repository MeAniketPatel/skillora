import type {
  CareerPath,
  SkillGapRecommendation,
  SkillNode,
  Testimonial,
} from "@/types/marketing.types";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Amelia Rivers",
    role: "Student",
    rating: 5,
    quote:
      "Skillora turned my weekends into a full-stack engineering bootcamp. The structured paths and live sessions kept me accountable every single day.",
    highlight: "Landed a senior role in 11 weeks",
  },
  {
    id: "testimonial-2",
    name: "Marcus Chen",
    role: "Teacher",
    rating: 5,
    quote:
      "I scaled my design cohort to over 4,000 students without losing the personal touch. The curriculum builder is hands-down the most polished I've used.",
    highlight: "4,000+ active learners",
  },
  {
    id: "testimonial-3",
    name: "Priya Anand",
    role: "Student",
    rating: 4,
    quote:
      "The AI tutor and spaced-repetition flashcards rewired how I study. I finally retained the calculus I struggled with for two years.",
    highlight: "Aced her final exam",
  },
  {
    id: "testimonial-4",
    name: "David Okafor",
    role: "Teacher",
    rating: 5,
    quote:
      "Outgoing webhooks and granular analytics let me integrate Skillora directly into my CRM. It's the only LMS that respects a teacher's workflow.",
    highlight: "Automated his entire funnel",
  },
];

export const SKILL_CATALOG: SkillNode[] = [
  {
    id: "javascript",
    label: "JavaScript",
    description: "Modern ES2024 syntax, async patterns, and the DOM.",
    category: "technical",
  },
  {
    id: "react",
    label: "React",
    description: "Hooks, server components, and state management.",
    category: "technical",
  },
  {
    id: "data-science",
    label: "Data Science",
    description: "Pandas, modeling, and statistical inference.",
    category: "technical",
  },
  {
    id: "ui-design",
    label: "UI Design",
    description: "Visual hierarchy, color, and design systems.",
    category: "creative",
  },
  {
    id: "copywriting",
    label: "Copywriting",
    description: "Conversion-focused writing for web and email.",
    category: "creative",
  },
  {
    id: "product-management",
    label: "Product Management",
    description: "Discovery, prioritization, and roadmap rituals.",
    category: "business",
  },
  {
    id: "leadership",
    label: "Leadership",
    description: "Coaching, feedback, and high-trust teams.",
    category: "business",
  },
  {
    id: "public-speaking",
    label: "Public Speaking",
    description: "Storytelling, presence, and stage confidence.",
    category: "language",
  },
];

export const SKILL_RECOMMENDATIONS: SkillGapRecommendation[] = [
  { skill: SKILL_CATALOG[0], courseIds: [] },
  { skill: SKILL_CATALOG[1], courseIds: [] },
  { skill: SKILL_CATALOG[2], courseIds: [] },
  { skill: SKILL_CATALOG[3], courseIds: [] },
  { skill: SKILL_CATALOG[4], courseIds: [] },
  { skill: SKILL_CATALOG[5], courseIds: [] },
  { skill: SKILL_CATALOG[6], courseIds: [] },
  { skill: SKILL_CATALOG[7], courseIds: [] },
];

export const CAREER_PATHS: CareerPath[] = [
  {
    id: "fullstack-developer",
    title: "Full-Stack Web Developer",
    icon: "Code2",
    summary:
      "Build production-ready web applications from API to deployment.",
    averageSalary: "$92k – $138k",
    growthRate: "+23% YoY",
    steps: [
      {
        id: "fs-1",
        title: "Foundations of HTML, CSS, and JavaScript",
        description:
          "Master the modern browser platform, semantic markup, and the DOM.",
        duration: "3 weeks",
        skills: ["JavaScript"],
        courseSlugs: [],
      },
      {
        id: "fs-2",
        title: "Component-Driven React",
        description:
          "Hooks, server components, and accessible design systems.",
        duration: "4 weeks",
        skills: ["React"],
        courseSlugs: [],
      },
      {
        id: "fs-3",
        title: "Backend APIs with Node and Prisma",
        description:
          "REST, validation, and type-safe persistence with PostgreSQL.",
        duration: "5 weeks",
        skills: ["JavaScript"],
        courseSlugs: [],
      },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    icon: "LineChart",
    summary:
      "Translate business questions into models, dashboards, and stories.",
    averageSalary: "$110k – $165k",
    growthRate: "+31% YoY",
    steps: [
      {
        id: "ds-1",
        title: "Python for Data Analysis",
        description: "Pandas, NumPy, and exploratory data analysis.",
        duration: "4 weeks",
        skills: ["Data Science"],
        courseSlugs: [],
      },
      {
        id: "ds-2",
        title: "Statistical Modeling",
        description: "Inference, regression, and experimental design.",
        duration: "6 weeks",
        skills: ["Data Science"],
        courseSlugs: [],
      },
      {
        id: "ds-3",
        title: "Machine Learning in Production",
        description: "Feature pipelines, model evaluation, and MLOps basics.",
        duration: "6 weeks",
        skills: ["Data Science", "Leadership"],
        courseSlugs: [],
      },
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    icon: "PenTool",
    summary:
      "Lead end-to-end product design from research to high-fidelity handoff.",
    averageSalary: "$95k – $148k",
    growthRate: "+18% YoY",
    steps: [
      {
        id: "pd-1",
        title: "Design Fundamentals",
        description: "Typography, color, and visual rhythm.",
        duration: "3 weeks",
        skills: ["UI Design"],
        courseSlugs: [],
      },
      {
        id: "pd-2",
        title: "Interaction & Motion",
        description: "Micro-interactions, prototyping, and design systems.",
        duration: "4 weeks",
        skills: ["UI Design", "Product Management"],
        courseSlugs: [],
      },
      {
        id: "pd-3",
        title: "Research-Led Design Sprints",
        description: "Interviews, synthesis, and validated prototypes.",
        duration: "4 weeks",
        skills: ["Product Management", "Public Speaking"],
        courseSlugs: [],
      },
    ],
  },
];

export const PLATFORM_STATS = [
  { id: "students", label: "Active Learners", value: 48230, suffix: "+" },
  { id: "courses", label: "Curated Courses", value: 1240, suffix: "+" },
  { id: "instructors", label: "Expert Instructors", value: 318, suffix: "" },
  { id: "certificates", label: "Certificates Issued", value: 9600, suffix: "+" },
] as const;
