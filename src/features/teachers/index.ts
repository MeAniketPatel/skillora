// Auto-generated barrel: re-exports all repositories for the teachers feature.

// Components
export { AnalyticsClient } from "./components/analytics";
export { AnalyticsFilters } from "./components/analytics/analytics-filters";
export { AnalyticsOverview } from "./components/analytics/analytics-overview";
export { AnalyticsStudentsTable } from "./components/analytics/analytics-students-table";
export { AnalyticsSubmissions } from "./components/analytics/analytics-submissions";
export { AnnouncementForm } from "./components/announcement-form";
export { AnnouncementList } from "./components/announcement-list";
export { CourseInsights } from "./components/course-insights";
export { PayoutDashboard } from "./components/payout-dashboard";
export { PeerReviewConfig } from "./components/peer-review-config";
export { RecentEnrollments } from "./components/recent-enrollments";
export { SubmissionTable } from "./components/submission-table";
export { TeacherStats } from "./components/teacher-stats";

// Permissions
export { canTeachers as canTeachers, assertTeachersAccess } from "./permissions/teachers.permissions";




// Contracts
export { createTeachersSchema, updateTeachersSchema, listTeachersQuerySchema } from "./contracts/teachers.contract";
export type { CreateTeachersInput, UpdateTeachersInput } from "./contracts/teachers.contract";
