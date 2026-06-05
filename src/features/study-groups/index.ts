// study-groups feature barrel
export * from "./repositories";

// Components
export { CreateGroupForm } from "./components/create-group-form";
export { GroupCard } from "./components/group-card";
export { GroupChat } from "./components/group-chat";
// Permissions
export { canStudyGroups as canStudyGroups, assertStudyGroupsAccess } from "./permissions/study-groups.permissions";

// Contracts
export { createStudyGroupsSchema, updateStudyGroupsSchema, listStudyGroupsQuerySchema } from "./contracts/study-groups.contract";
export type { CreateStudyGroupsInput, UpdateStudyGroupsInput, ListStudyGroupsQuery } from "./contracts/study-groups.contract";

// Hooks
export {  useStudyGroupsList, useStudyGroupsDetail, useStudyGroupsCreate, useStudyGroupsUpdate, useStudyGroupsDelete } from "./hooks/use-study-groups";


// Services
export { studyGroupsService } from "./services/study-groups.service";
export type { StudyGroupsService } from "./services/study-groups.service";
