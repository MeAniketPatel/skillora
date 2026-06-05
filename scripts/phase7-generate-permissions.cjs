#!/usr/bin/env node
/**
 * Generate permissions modules for every feature.
 *
 * For each feature, creates `permissions/<feature>.permissions.ts` exporting
 * a `can<Feature>` object with action keys mapped to role sets. The script
 * is a starter template — features with specific role logic override the
 * generated file by hand (e.g. `auth`, `admin`).
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

const FEATURE_ROLES = {
  admin: ["ADMIN"],
  announcements: ["TEACHER", "ADMIN"],
  assignments: ["TEACHER", "STUDENT", "ADMIN"],
  auth: ["PUBLIC", "STUDENT", "TEACHER", "ADMIN"],
  blog: ["PUBLIC", "ADMIN"],
  bundles: ["STUDENT", "TEACHER", "ADMIN"],
  cart: ["STUDENT", "ADMIN"],
  categories: ["PUBLIC", "ADMIN"],
  certificates: ["STUDENT", "TEACHER", "ADMIN"],
  chat: ["STUDENT", "TEACHER", "ADMIN"],
  code: ["STUDENT", "TEACHER", "ADMIN"],
  contact: ["PUBLIC", "ADMIN"],
  courses: ["PUBLIC", "TEACHER", "ADMIN"],
  discussions: ["STUDENT", "TEACHER", "ADMIN"],
  email: ["STUDENT", "TEACHER", "ADMIN"],
  enrollment: ["STUDENT", "TEACHER", "ADMIN"],
  feature: ["ADMIN"],
  flashcards: ["STUDENT", "TEACHER", "ADMIN"],
  gamification: ["STUDENT", "TEACHER", "ADMIN"],
  gift: ["STUDENT", "ADMIN"],
  learn: ["STUDENT", "TEACHER", "ADMIN"],
  learning: ["STUDENT", "TEACHER", "ADMIN"],
  marketing: ["PUBLIC"],
  notifications: ["STUDENT", "TEACHER", "ADMIN"],
  payments: ["STUDENT", "TEACHER", "ADMIN"],
  polls: ["TEACHER", "STUDENT", "ADMIN"],
  profile: ["STUDENT", "TEACHER", "ADMIN"],
  referrals: ["STUDENT", "ADMIN"],
  reviews: ["STUDENT", "TEACHER", "ADMIN"],
  search: ["PUBLIC", "STUDENT", "TEACHER", "ADMIN"],
  settings: ["STUDENT", "TEACHER", "ADMIN"],
  skill: ["STUDENT", "TEACHER", "ADMIN"],
  social: ["STUDENT", "TEACHER", "ADMIN"],
  students: ["STUDENT", "TEACHER", "ADMIN"],
  study: ["STUDENT", "TEACHER", "ADMIN"],
  subscriptions: ["STUDENT", "TEACHER", "ADMIN"],
  teachers: ["TEACHER", "ADMIN"],
  webhooks: ["ADMIN"],
  wishlist: ["STUDENT", "ADMIN"],
};

const ACTIONS = ["view", "create", "update", "delete"];

function rolesFor(feature) {
  const key = Object.keys(FEATURE_ROLES).find((k) => feature.startsWith(k));
  return key ? FEATURE_ROLES[key] : ["STUDENT", "TEACHER", "ADMIN"];
}

const features = fs
  .readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let created = 0;
for (const feature of features) {
  const permsDir = path.join(featuresDir, feature, "permissions");
  fs.mkdirSync(permsDir, { recursive: true });
  const out = path.join(permsDir, `${feature}.permissions.ts`);
  if (fs.existsSync(out)) continue;
  const roles = rolesFor(feature);
  const body = `// Auto-generated permission map for the ${feature} feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const can${toPascal(feature)}: Record<string, AccessRule> = {
  view: ${roles.includes("PUBLIC") ? '"PUBLIC"' : JSON.stringify(roles)},
  create: ${JSON.stringify(roles.filter((r) => r !== "PUBLIC"))},
  update: ${JSON.stringify(roles.filter((r) => r === "ADMIN" || r === "TEACHER"))},
  delete: ${JSON.stringify(roles.filter((r) => r === "ADMIN"))},
};

export function assert${toPascal(feature)}Access(role: Role | null | undefined, action: keyof typeof can${toPascal(feature)} = "view") {
  const rule = can${toPascal(feature)}[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(\`Access denied: role '\${role ?? "anonymous"}' cannot \${action} ${feature}\`);
  }
}
`;
  fs.writeFileSync(out, body, "utf8");
  const barrel = path.join(featuresDir, feature, "index.ts");
  let barrelText = fs.readFileSync(barrel, "utf8");
  if (!barrelText.includes("permissions")) {
    barrelText += `\n// Permissions\nexport { can${toPascal(feature)} as can${toPascal(feature)}, assert${toPascal(feature)}Access } from "./permissions/${feature}.permissions";\n`;
  }
  fs.writeFileSync(barrel, barrelText, "utf8");
  created += 1;
}

function toPascal(s) {
  return s
    .split(/[-_]/)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

console.log(`Permissions created for ${created} features.`);
