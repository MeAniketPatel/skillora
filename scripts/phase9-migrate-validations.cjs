#!/usr/bin/env node
/**
 * Move legacy Zod schemas from src/validations/<name>.schema.ts to the
 * matching feature's contract file (src/features/<name>/contracts/<name>.contract.ts).
 * Rewrites @/validations/<name>.schema imports to @/features/<name>/contracts/<name>.contract.
 *
 * Skips the 3 shared schemas (common.schema, pagination.schema) since they
 * already live under shared/validations/ — actions still importing them keep
 * their @/shared/validations alias.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const validationsDir = path.join(root, "src", "validations");
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

if (!fs.existsSync(validationsDir)) {
  console.log("No legacy validations dir — nothing to migrate.");
  process.exit(0);
}

const files = fs.readdirSync(validationsDir).filter((f) => f.endsWith(".schema.ts"));

const FEATURE_FROM_NAME = {
  admin: "admin",
  announcement: "announcements",
  "announcement.schema": "announcements",
  auth: "auth",
  blog: "blog",
  bookmark: "bookmarks",
  bundle: "bundles",
  category: "categories",
  collection: "collections",
  contact: "contact",
  coupon: "admin",
  course: "courses",
  discussion: "discussions",
  "email-preference": "email-preferences",
  enrollment: "enrollment",
  "feature-flag": "feature-flags",
  flashcard: "flashcards",
  "gift-card": "gift-cards",
  "learning-goal": "learning-goals",
  "learning-path": "learning-paths",
  "live-session": "live-sessions",
  message: "messages",
  moderation: "moderation",
  note: "notes",
  notification: "notifications",
  payment: "payments",
  payout: "payouts",
  "peer-review": "peer-reviews",
  poll: "polls",
  profile: "profile",
  qa: "qa",
  quiz: "quizzes",
  referral: "referrals",
  resource: "resources",
  review: "reviews",
  search: "search",
  settings: "settings",
  "skill-gap": "skill-gap",
  streak: "streaks",
  "study-group": "study-groups",
  subscription: "subscriptions",
  webhook: "webhooks",
  wishlist: "wishlist",
};

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

let moved = 0;
let merged = 0;
let rewrites = 0;

for (const file of files) {
  const base = file.replace(/\.schema\.ts$/, "");
  const feature = FEATURE_FROM_NAME[base] || base.replace(/s$/, "");
  const contractFile = path.join(featuresDir, feature, "contracts", `${base}.contract.ts`);
  const content = fs.readFileSync(path.join(validationsDir, file), "utf8");
  // Strip imports of zod for clarity
  if (fs.existsSync(contractFile)) {
    const existing = fs.readFileSync(contractFile, "utf8");
    if (existing.includes("TODO: define input shape")) {
      // Replace stub with real schema
      const imported = (content.match(/import\s*{[^}]*}\s*from\s*["']zod["']/g) || []).join("\n");
      const body = content.replace(/^import.*from\s*["']zod["'];?\s*$/gm, "").trim();
      const final = `${imported}\n\n// Real contract (migrated from src/validations/${file})\n${body}\n`;
      fs.writeFileSync(contractFile, final, "utf8");
      fs.unlinkSync(path.join(validationsDir, file));
      merged += 1;
    } else {
      // Append as additional exports
      const body = content.replace(/^import.*from\s*["']zod["'];?\s*$/gm, "").trim();
      fs.appendFileSync(contractFile, `\n// Re-exported from legacy src/validations/${file}\nexport {\n  ${body
        .split("\n")
        .filter((l) => /^export\s+(const|function|type|interface)\s+(\w+)/.test(l))
        .map((l) => l.match(/^export\s+(?:const|function|type|interface)\s+(\w+)/)[1])
        .join(",\n  ")}\n};\n`);
      fs.unlinkSync(path.join(validationsDir, file));
      merged += 1;
    }
  } else {
    fs.mkdirSync(path.dirname(contractFile), { recursive: true });
    const header = `import { z } from "zod";\n\n`;
    fs.writeFileSync(contractFile, header + content, "utf8");
    fs.unlinkSync(path.join(validationsDir, file));
    moved += 1;
  }
}

// Rewrite import sites
const importRe = /from\s*["']@\/validations\/([\w-]+)\.schema["']/g;
for (const f of walk(srcDir, [".ts", ".tsx"], [])) {
  if (f.includes(`${path.sep}features${path.sep}`)) continue;
  let text = fs.readFileSync(f, "utf8");
  const before = text;
  text = text.replace(importRe, (full, name) => {
    const feature = FEATURE_FROM_NAME[name] || name.replace(/s$/, "");
    return `from "@/features/${feature}/contracts/${name}.contract"`;
  });
  if (text !== before) {
    fs.writeFileSync(f, text, "utf8");
    rewrites += 1;
  }
}

console.log(`Moved ${moved} new contract files; merged ${merged} into stubs; rewrote imports in ${rewrites} files.`);
