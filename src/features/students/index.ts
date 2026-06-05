// Auto-generated barrel: re-exports all repositories for the students feature.

// Components
export { BookmarkButton } from "./components/bookmark-button";
export { ContinueLearning } from "./components/continue-learning";
export { CourseCollections as CourseCollection, CourseCollections as CourseCollections } from "./components/course-collection";
export { CreateCollectionForm } from "./components/create-collection-form";
export { CreateGoalForm } from "./components/create-goal-form";
export { DashboardStats } from "./components/dashboard-stats";
export { LearningGoals } from "./components/learning-goals";
export { NotesExporter } from "./components/notes-exporter";
export { StreakCalendar } from "./components/streak-calendar";
export { StreakFreezeButton } from "./components/streak-freeze-button";
export { StreakWidget } from "./components/streak-widget";
export { WeeklyProgress } from "./components/weekly-progress";

// Permissions
export { canStudents as canStudents, assertStudentsAccess } from "./permissions/students.permissions";

// Contracts
export { createStudentsSchema, updateStudentsSchema, listStudentsQuerySchema } from "./contracts/students.contract";
export type { CreateStudentsInput, UpdateStudentsInput, ListStudentsQuery } from "./contracts/students.contract";

// Hooks
export {  useStudentsList, useStudentsDetail, useStudentsCreate, useStudentsUpdate, useStudentsDelete } from "./hooks/use-students";

