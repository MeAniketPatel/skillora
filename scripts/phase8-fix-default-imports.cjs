#!/usr/bin/env node
/**
 * Convert `import X from "@/features/<f>"` to `import { X } from "@/features/<f>"`
 * where the imported name is one of the feature's named exports.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

function listFiles(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

const featureBarrelExports = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const barrel = path.join(featuresDir, f.name, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  const text = fs.readFileSync(barrel, "utf8");
  const named = new Set();
  const re = /export\s*\{\s*([^}]*)\s*\}\s*from/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    for (const part of m[1].split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const asMatch = trimmed.match(/^(?:default\s+)?as\s+(\w+)/);
      if (asMatch) {
        named.add(asMatch[1]);
      } else {
        const name = trimmed.replace(/\s+as\s+.*$/, "").trim();
        if (name && /^[A-Za-z_$][\w$]*$/.test(name)) named.add(name);
      }
    }
  }
  featureBarrelExports.set(f.name, named);
}

const targets = listFiles(srcDir, [".ts", ".tsx"], []);
const re = /^(\s*)import\s+(\w+)\s+from\s*(["'])@\/features\/([a-z0-9-]+)\3\s*;?\s*$/gm;

let replacements = 0;
let filesTouched = 0;
for (const file of targets) {
  let text = fs.readFileSync(file, "utf8");
  let changed = false;
  text = text.replace(re, (full, indent, name, quote, feature) => {
    const exports = featureBarrelExports.get(feature);
    if (!exports) return full;
    if (exports.has(name)) {
      replacements += 1;
      changed = true;
      return `${indent}import { ${name} } from ${quote}@/features/${feature}${quote};`;
    }
    return full;
  });
  if (changed) {
    fs.writeFileSync(file, text, "utf8");
    filesTouched += 1;
  }
}
console.log(`Replacements: ${replacements}, files: ${filesTouched}`);
