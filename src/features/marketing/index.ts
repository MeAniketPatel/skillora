export { FeaturedCourses } from "./components/featured-courses";
export { HeroSection } from "./components/hero-section";
export { InstructorCard } from "./components/instructor-card";
export { InstructorProfile } from "./components/instructor-profile";
export { PlatformStats } from "./components/platform-stats";
export { TestimonialCard } from "./components/testimonial-card";
export { TestimonialGrid } from "./components/testimonial-grid";

export { canMarketing as canMarketing, assertMarketingAccess } from "./permissions/marketing.permissions";




export { createMarketingSchema, updateMarketingSchema, listMarketingQuerySchema } from "./contracts/marketing.contract";
export type { CreateMarketingInput, UpdateMarketingInput } from "./contracts/marketing.contract";
