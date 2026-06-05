const re = /^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/;
const line = 'import { service as studentsService } from "@/features/students/server";';
const m = line.match(re);
console.log("groups:");
for (let i = 0; i < m.length; i++) console.log(`  [${i}]:`, JSON.stringify(m[i]));
