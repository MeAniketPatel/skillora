// Auto-generated barrel: re-exports all repositories for the skill-gap feature.
export * from "./repositories/skill-gap.repository";

// Services
export { skillGapService } from "./services/skill-gap.service";
export type { SkillGapService } from "./services/skill-gap.service";

// Permissions
export { canSkillGap as canSkillGap, assertSkillGapAccess } from "./permissions/skill-gap.permissions";

// Contracts
export { createSkillGapSchema, updateSkillGapSchema, listSkillGapQuerySchema } from "./contracts/skill-gap.contract";
export type { CreateSkillGapInput, UpdateSkillGapInput, ListSkillGapQuery } from "./contracts/skill-gap.contract";

// Hooks
export {  useSkillGapList, useSkillGapDetail, useSkillGapCreate, useSkillGapUpdate, useSkillGapDelete } from "./hooks/use-skill-gap";

