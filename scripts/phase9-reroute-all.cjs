#!/usr/bin/env node
/**
 * Re-route every import of a feature repository function in the application
 * (actions, pages, lib) to import from the feature's server barrel.
 *
 * Handles:
 *   - `import { a, b } from "@/features/<f>"`  (static)
 *   - `import("@/features/<f>")`                (dynamic)
 *   - `import type { a } from "@/features/<f>"` (type re-exports stay in client)
 *
 * Re-routes only when at least one imported name is a repository function.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

function listFiles(dir, exts, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((x) => e.name.endsWith(x))) results.push(full);
  }
  return results;
}

// Build map: feature -> Set of names exposed in server barrel.
const featureServerExports = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const sb = path.join(featuresDir, f.name, "server.ts");
  if (!fs.existsSync(sb)) continue;
  const text = fs.readFileSync(sb, "utf8");
  const names = new Set();
  const re = /export\s+(?:type\s+)?\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    for (const part of m[1].split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const asMatch = trimmed.match(/^(?:default\s+)?as\s+(\w+)/);
      if (asMatch) names.add(asMatch[1]);
      else {
        const name = trimmed.replace(/\s+as\s+.*$/, "").trim();
        if (name && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
      }
    }
  }
  if (/export\s*\*\s*from/.test(text)) names.add("*");
  featureServerExports.set(f.name, names);
}

// Files to scan: everything under src/ except barrel/index/server files of features.
function shouldScan(file) {
  if (file.includes(`${path.sep}node_modules${path.sep}`)) return false;
  const isFeatureBarrel = /[\\/]features[\\/][^\\/]+[\\/](index|server)\.ts$/.test(file);
  if (isFeatureBarrel) return false;
  return true;
}

const targets = listFiles(srcDir, [".ts", ".tsx"], []).filter(shouldScan);

const importRe = /^(\s*)import\s*(type\s+)?\{([^}]+)\}\s*from\s*(["'])@\/features\/([a-z0-9-]+)\4\s*;?\s*$/gm;
const dynRe = /import\(\s*(["'])@\/features\/([a-z0-9-]+)\1\s*\)/g;

let totalStatic = 0;
let totalDyn = 0;
let filesTouched = 0;

for (const file of targets) {
  let text = fs.readFileSync(file, "utf8");
  const orig = text;
  text = text.replace(importRe, (full, indent, typeKw, names, quote, feature) => {
    const exports = featureServerExports.get(feature);
    if (!exports) return full;
    const items = names.split(",").map((n) => n.trim()).filter(Boolean);
    const baseNames = items.map((n) => n.replace(/\s+as\s+.*$/, "").trim());
    const serverOnly = baseNames.filter((n) => exports.has(n) || exports.has("*"));
    if (serverOnly.length === 0) return full;
    totalStatic += 1;
    return `${indent}import ${typeKw || ""}{ ${items.join(", ")} } from ${quote}@/features/${feature}/server${quote};`;
  });
  text = text.replace(dynRe, (full, quote, feature) => {
    if (!featureServerExports.has(feature)) return full;
    totalDyn += 1;
    return `import(${quote}@/features/${feature}/server${quote})`;
  });
  if (text !== orig) {
    fs.writeFileSync(file, text, "utf8");
    filesTouched += 1;
  }
}
console.log(`Re-routed ${totalStatic} static + ${totalDyn} dynamic imports in ${filesTouched} files.`);
