// marketing feature barrel
export * from "./repositories";

// Components
export { CareerHub } from "./components/career-hub";
export { FeaturedCourses } from "./components/featured-courses";
export { HeroSection } from "./components/hero-section";
export { InstructorCard } from "./components/instructor-card";
export { InstructorProfile } from "./components/instructor-profile";
export { PlatformStats } from "./components/platform-stats";
export { PricingTable } from "./components/pricing-table";
export { SkillGapAnalyzer } from "./components/skill-gap-analyzer";
export { TestimonialCard } from "./components/testimonial-card";
export { TestimonialGrid } from "./components/testimonial-grid";
// Permissions
export { canMarketing as canMarketing, assertMarketingAccess } from "./permissions/marketing.permissions";

// Contracts
export { createMarketingSchema, updateMarketingSchema, listMarketingQuerySchema } from "./contracts/marketing.contract";
export type { CreateMarketingInput, UpdateMarketingInput, ListMarketingQuery } from "./contracts/marketing.contract";

// Hooks
export {  useMarketingList, useMarketingDetail, useMarketingCreate, useMarketingUpdate, useMarketingDelete } from "./hooks/use-marketing";


// Services
export { marketingService } from "./services/marketing.service";
export type { MarketingService } from "./services/marketing.service";
