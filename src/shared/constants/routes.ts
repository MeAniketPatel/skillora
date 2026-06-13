export const ROUTES = {
  // Public
  HOME: "/",
  COURSES: "/courses",
  COURSE_DETAIL: (slug: string) => `/courses/${slug}` as const,
  ABOUT: "/about",
  CONTACT: "/contact", // Deprecated - feature removed
  PRICING: "/pricing", // Deprecated - feature removed
  COMPARE: "/compare",
  SEARCH: "/search",
  CAREERS: "/careers", // Deprecated - feature removed
  INSTRUCTORS: "/instructors",
  INSTRUCTOR_DETAIL: (id: string) => `/instructors/${id}` as const,
  CERTIFICATE_VIEW: (certId: string) => `/certificates/${certId}` as const,
  CERTIFICATE_VERIFY: (certId: string) =>
    `/certificates/verify/${certId}` as const,

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Dashboard (redirector)
  DASHBOARD: "/dashboard",

  // Student
  STUDENT_COURSES: "/student/courses",
  STUDENT_PURCHASES: "/student/purchases",
  STUDENT_CERTIFICATES: "/student/certificates",
  STUDENT_WISHLIST: "/student/wishlist", // Deprecated - feature removed

  // Learn
  LEARN_COURSE: (courseId: string) => `/learn/${courseId}` as const,
  LEARN_LESSON: (courseId: string, lessonId: string) =>
    `/learn/${courseId}/${lessonId}` as const,

  // Learning paths
  LEARNING_PATHS: "/learning-paths",

  // Teacher
  TEACHER_COURSES: "/teacher/courses",
  TEACHER_COURSE_NEW: "/teacher/courses/new",
  TEACHER_COURSE_EDIT: (courseId: string) =>
    `/teacher/courses/${courseId}` as const,
  TEACHER_CURRICULUM: (courseId: string) =>
    `/teacher/courses/${courseId}/curriculum` as const,
  TEACHER_LESSON_EDIT: (courseId: string, lessonId: string) =>
    `/teacher/courses/${courseId}/lessons/${lessonId}` as const,
  TEACHER_ANALYTICS: "/teacher/analytics",
  TEACHER_EARNINGS: "/teacher/earnings",
  TEACHER_STUDENTS: (courseId: string) =>
    `/teacher/courses/${courseId}/students` as const,
  TEACHER_REVIEWS: "/teacher/reviews",
  TEACHER_QA: "/teacher/qa", // Deprecated - feature removed
  TEACHER_COUPONS: "/teacher/coupons", // Deprecated - feature removed
  TEACHER_PAYOUTS: "/teacher/payouts", // Deprecated - feature removed
  TEACHER_ASSIGNMENTS: (courseId: string) =>

    `/teacher/courses/${courseId}/assignments` as const,

  // Admin
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_REVENUE: "/admin/revenue", // Deprecated - feature removed
  ADMIN_AUDIT: "/admin/audit", // Deprecated - feature removed
  ADMIN_COUPONS: "/admin/coupons", // Deprecated - feature removed
  ADMIN_REPORTS: "/admin/reports", // Deprecated - feature removed
  ADMIN_CONTACT_MESSAGES: "/admin/contact", // Deprecated - feature removed

  // Settings
  SETTINGS: "/settings",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_PRIVACY: "/settings/privacy",
} as const;
