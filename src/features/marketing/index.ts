export { FeaturedCourses } from "./components/featured-courses";
export { HeroSection } from "./components/hero-section";
export { InstructorCard } from "./components/instructor-card";
export { InstructorProfile } from "./components/instructor-profile";
export { PlatformStats } from "./components/platform-stats";
export { TestimonialCard } from "./components/testimonial-card";
export { TestimonialGrid } from "./components/testimonial-grid";

// Redesigned & New Components
export { SocialProof } from "./components/social-proof";
export { CategoriesSection } from "./components/categories-section";
export { LearningExperience } from "./components/learning-experience";
export { SuccessStories } from "./components/success-stories";
export { InstructorShowcase } from "./components/instructor-showcase";
export { CertificationSection } from "./components/certification-section";
export { PricingPreview } from "./components/pricing-preview";
export { FAQSection } from "./components/faq-section";
export { FinalCTA } from "./components/final-cta";

export { canMarketing, assertMarketingAccess } from "./permissions/marketing.permissions";

export { createMarketingSchema, updateMarketingSchema, listMarketingQuerySchema } from "./contracts/marketing.contract";
export type { CreateMarketingInput, UpdateMarketingInput } from "./contracts/marketing.contract";
