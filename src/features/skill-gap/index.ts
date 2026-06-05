// Auto-generated barrel: re-exports all repositories for the skill-gap feature.

// Permissions
export { canSkillGap as canSkillGap, assertSkillGapAccess } from "./permissions/skill-gap.permissions";




// Contracts
export { createSkillGapSchema, updateSkillGapSchema, listSkillGapQuerySchema } from "./contracts/skill-gap.contract";
export type { CreateSkillGapInput, UpdateSkillGapInput } from "./contracts/skill-gap.contract";


export { recommendSkillGapAction } from "./actions/skill-gap.actions";
