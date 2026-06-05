#!/usr/bin/env node
/**
 * Rewrite every @/validations/<name>.schema import across src/ (including
 * self-feature files) to @/features/<feature>/contracts/<name>.contract.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

// Build mapping: <name>.schema -> feature (matches phase9-migrate-validations.cjs)
const FEATURE_FROM_NAME = {
  admin: "admin",
  announcement: "announcements",
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

let rewrites = 0;
for (const f of walk(srcDir, [".ts", ".tsx"], [])) {
  let text = fs.readFileSync(f, "utf8");
  const before = text;
  text = text.replace(
    /from\s*["']@\/validations\/([\w-]+)\.schema["']/g,
    (full, name) => {
      const feature = FEATURE_FROM_NAME[name] || name;
      return `from "@/features/${feature}/contracts/${name}.contract"`;
    }
  );
  if (text !== before) {
    fs.writeFileSync(f, text, "utf8");
    rewrites += 1;
  }
}

// Remove leftover src/validations/index.ts references
const validationsDir = path.join(srcDir, "validations");
if (fs.existsSync(validationsDir)) {
  for (const f of fs.readdirSync(validationsDir)) {
    fs.unlinkSync(path.join(validationsDir, f));
  }
  fs.rmdirSync(validationsDir);
  console.log("Removed empty src/validations/ directory.");
}

console.log(`Rewrote imports in ${rewrites} files.`);
