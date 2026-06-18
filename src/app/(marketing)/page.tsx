import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { 
  HeroSection, 
  SocialProof,
  PlatformStats, 
  FeaturedCourses,
  CategoriesSection,
  LearningExperience,
  SuccessStories,
  InstructorShowcase,
  CertificationSection,
  PricingPreview,
  FAQSection,
  FinalCTA
} from "@/features/marketing";
import { getPublishedCourses } from "@/features/courses/server";
import { getAllCategories } from "@/features/categories/server";
import { ROUTES } from "@/shared/constants/routes";

export default async function HomePage() {
  const session = await auth();
  
  // If the user has an active session, redirect them to dashboard
  if (session?.user) {
    redirect(ROUTES.DASHBOARD);
  }

  let courses: any[] = [];
  let categories: any[] = [];

  // Safely fetch published courses
  try {
    const coursesResult = await getPublishedCourses({ limit: 6, sort: "popular" });
    courses = coursesResult.courses || [];
  } catch (error) {
    console.error("Failed to load courses on homepage:", error);
  }

  // Safely fetch categories
  try {
    categories = await getAllCategories() || [];
  } catch (error) {
    console.error("Failed to load categories on homepage:", error);
  }

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      <HeroSection />
      <SocialProof />
      <PlatformStats />
      <FeaturedCourses courses={courses} />
      <CategoriesSection categories={categories} />
      <LearningExperience />
      <SuccessStories />
      <InstructorShowcase />
      <CertificationSection />
      <PricingPreview />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
