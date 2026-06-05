#!/usr/bin/env node
/**
 * Delete the auto-generated stub hook files (use-<feature>.ts) from every
 * feature. The hooks import services directly which transitively pulls
 * Prisma into client bundles, breaking `next build`. They were never
 * actually adopted by any page. Real, fetch-based hooks will be added
 * back as a follow-up.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let deleted = 0;
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const hooksDir = path.join(featuresDir, f.name, "hooks");
  if (!fs.existsSync(hooksDir)) continue;
  for (const h of fs.readdirSync(hooksDir)) {
    if (h.startsWith("use-") && h.endsWith(".ts")) {
      fs.unlinkSync(path.join(hooksDir, h));
      deleted += 1;
    }
  }
}
console.log(`Deleted ${deleted} stub hook files.`);
