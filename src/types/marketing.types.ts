export interface Testimonial {
  id: string;
  name: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl?: string;
  rating: number;
  quote: string;
  highlight?: string;
}

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  category: "technical" | "creative" | "business" | "language";
}

export interface SkillGapRecommendation {
  skill: SkillNode;
  courseIds: string[];
}

export interface CareerPathStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  courseSlugs: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  icon: string;
  summary: string;
  averageSalary: string;
  growthRate: string;
  steps: CareerPathStep[];
}

export interface InstructorCardData {
  id: string;
  name: string | null;
  headline: string | null;
  image: string | null;
  bio: string | null;
  publishedCourseCount: number;
  totalStudents: number;
  averageRating: number;
  isFeatured?: boolean;
}
