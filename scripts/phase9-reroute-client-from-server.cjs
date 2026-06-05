#!/usr/bin/env node
/**
 * Find every "use client" file that imports from @/features/<f>/server
 * and re-route those imports to the specific action or repository file
 * that contains the named export. Server barrels pull in service
 * re-exports that transitively include Prisma; pointing the client file
 * at a leaf "use server" action file lets the bundler stub the call.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

// Build a map: feature -> { actionFile, repoFiles[] }
const featureImports = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const arr = { actionFile: null, repoFiles: [] };
  const actionsDir = path.join(featuresDir, f.name, "actions");
  if (fs.existsSync(actionsDir)) {
    for (const af of fs.readdirSync(actionsDir)) {
      if (af.endsWith(".actions.ts") || af.endsWith(".action.ts")) {
        arr.actionFile = path.join("actions", af);
        break;
      }
    }
  }
  const reposDir = path.join(featuresDir, f.name, "repositories");
  if (fs.existsSync(reposDir)) {
    for (const rf of fs.readdirSync(reposDir)) {
      if (rf.endsWith(".repository.ts")) arr.repoFiles.push(path.join("repositories", rf));
    }
  }
  featureImports.set(f.name, arr);
}

// Find the definition file for a given exported name (function, const, type)
function findDefinition(feature, name) {
  const info = featureImports.get(feature);
  if (!info) return null;
  // Prefer action file (these have "use server" so safe for client to import)
  if (info.actionFile) {
    const fp = path.join(featuresDir, feature, info.actionFile);
    if (fs.existsSync(fp)) {
      const text = fs.readFileSync(fp, "utf8");
      const re = new RegExp(`export\\s+(?:async\\s+)?function\\s+${name}\\b`);
      if (re.test(text)) return info.actionFile;
    }
  }
  for (const rf of info.repoFiles) {
    const fp = path.join(featuresDir, feature, rf);
    const text = fs.readFileSync(fp, "utf8");
    if (new RegExp(`export\\s+(?:async\\s+)?function\\s+${name}\\b`).test(text)) return rf;
  }
  return null;
}

let updated = 0;
const importRe = /^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/gm;
for (const f of walk(srcDir, [".ts", ".tsx"], [])) {
  let text = fs.readFileSync(f, "utf8");
  // Only consider files that start with "use client"
  if (!/^\s*["']use client["']/.test(text)) continue;
  const before = text;
  text = text.replace(importRe, (full, indent, names, mod) => {
    const feature = mod.replace(/^@\/features\//, "").replace(/\/server$/, "");
    const items = names.split(",").map((s) => s.trim()).filter(Boolean);
    const groups = new Map();
    for (const item of items) {
      const asMatch = item.match(/^(\w+)\s+as\s+(\w+)$/);
      const original = asMatch ? asMatch[1] : item;
      const alias = asMatch ? asMatch[2] : item;
      const def = findDefinition(feature, original);
      if (!def) continue;
      const importPath = `@/features/${feature}/${def.replace(/\.ts$/, "")}`;
      const key = importPath;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(alias === original ? original : `${original} as ${alias}`);
    }
    if (groups.size === 0) return full;
    return [...groups.entries()].map(([rel, list]) => `${indent}import { ${list.join(", ")} } from "${rel}";`).join("\n");
  });
  if (text !== before) {
    fs.writeFileSync(f, text, "utf8");
    updated += 1;
  }
}
console.log(`Re-routed ${updated} client files away from @/features/<f>/server.`);
