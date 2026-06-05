"use server";

import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { getSkillGapRecommendations } from "@/features/skill-gap/repositories/skill-gap.repository";

const skillGapSchema = z.object({
  skills: z
    .array(z.string().min(1).max(64))
    .min(1, "Pick at least one skill")
    .max(4, "Pick up to 4 skills"),
});

export async function recommendSkillGapAction(input: string[]) {
  return actionHandler(async () => {
    const { skills } = skillGapSchema.parse({ skills: input });
    const results = await getSkillGapRecommendations(skills);
    return { recommendations: results };
  });
}
