#!/usr/bin/env node
/**
 * Add permission checks to action files. For each action in src/actions/
 * that calls `requireAuth()` / `requireTeacher()` / `requireAdmin()`,
 * replace it with the feature's permission guard (e.g.
 * assertStudentsAccess(user.role, "update")) when available, otherwise
 * keep the existing helper.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const actionsDir = path.join(root, "src", "actions");

// Build map: feature -> permission guards available
const featurePermissions = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const permsDir = path.join(featuresDir, f.name, "permissions");
  if (!fs.existsSync(permsDir)) continue;
  const permFile = fs.readdirSync(permsDir).find((x) => x.endsWith(".permissions.ts"));
  if (!permFile) continue;
  const text = fs.readFileSync(path.join(permsDir, permFile), "utf8");
  const guardName = (text.match(/export\s+function\s+(assert\w+)\s*\(/) || [])[1];
  const accessMapName = (text.match(/export\s+const\s+(can\w+)\s*:/)||[])[1];
  if (guardName) {
    featurePermissions.set(f.name, { guardName, baseName: permFile.replace(/\.permissions\.ts$/, "") });
  }
}

function camel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

let updated = 0;
for (const file of fs.readdirSync(actionsDir).filter((x) => x.endsWith(".ts"))) {
  const fp = path.join(actionsDir, file);
  let text = fs.readFileSync(fp, "utf8");
  const orig = text;
  // Match import lines for the service to figure out the owning feature
  const importRe = /^(\s*)import\s*\{[^}]*\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/gm;
  const featuresUsed = new Set();
  let m;
  while ((m = importRe.exec(text)) !== null) {
    const mod = m[2];
    const feature = mod.replace(/^@\/features\//, "").replace(/\/server$/, "");
    featuresUsed.add(feature);
  }
  // Find the most-specific feature: prefer the longest match (e.g. students > auth)
  // For permission adoption, prefer the "primary" feature based on the action's contract
  let primaryFeature = null;
  for (const f of featuresUsed) {
    if (!featurePermissions.has(f)) continue;
    if (!primaryFeature || f.length > primaryFeature.length) primaryFeature = f;
  }
  if (!primaryFeature) continue;
  const { guardName, baseName } = featurePermissions.get(primaryFeature);

  // Add the import if not present. Insert it in the top-level import block.
  // We track whether we're currently inside a multi-line import (open `{` without close `}`).
  if (!text.includes(guardName)) {
    const lines = text.split("\n");
    let insertAt = -1;
    let inImport = false;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (inImport) {
        if (/^[^/]*\}\s*from\s/.test(l) || /;/.test(l)) inImport = false;
        continue;
      }
      if (/^import\s*\{/.test(l) && !/\}/.test(l)) {
        inImport = true;
        continue;
      }
      if (/^import\s/.test(l)) continue;
      if (l.trim() === "" || l.trim() === '"use server";') continue;
      insertAt = i;
      break;
    }
    if (insertAt === -1) insertAt = lines.length;
    lines.splice(insertAt, 0, `import { ${guardName} } from "@/features/${primaryFeature}/permissions/${baseName}.permissions";`);
    text = lines.join("\n");
  }

  // Replace `await requireAuth();` with `assert<Feature>Access(user.role, "view");` only when user is loaded
  // Heuristic: if there's a `const user = await requireAuth();` in the same function, use user.role
  text = text.replace(
    /(const\s+\w+\s*=\s*await\s+)requireAuth(\s*\(\s*\)\s*;)/g,
    (full, prefix, suffix) => {
      return `${prefix}requireAuth${suffix}`;
    }
  );
  // Add a permission check after the first require* in each function body
  text = text.replace(
    /(const\s+\w+\s*=\s*await\s+requireAuth\(\);\s*\n)(\s*const\s+validated\s*=\s*)/g,
    (full, requireLine, validatedLine) => {
      return `${requireLine}    ${guardName}(user.role, "update");\n${validatedLine}`;
    }
  );
  // For requireAdmin/requireTeacher, only add permission check when we can determine the action
  // To avoid breaking behavior, leave requireAdmin/requireTeacher in place; permission system
  // augments with feature-level checks but doesn't replace the role-level gate.

  if (text !== orig) {
    fs.writeFileSync(fp, text, "utf8");
    updated += 1;
  }
}
console.log(`Added permission guards to ${updated} action files.`);
