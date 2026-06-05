#!/usr/bin/env node
/**
 * Phase 17 codemod: rewrite `import ... from "@/data"` imports to use feature barrels.
 *
 * Strategy:
 *  1. Build a symbol-to-feature map by scanning all repository files in src/features.
 *  2. For every `.ts`/`.tsx` file in `src/` (excluding the data shim and repository files
 *     themselves), find `import { ... } from "@/data"` and rewrite using the feature map.
 *  3. Mixed imports (some symbols from `@/data`, some from other specifiers) are split into
 *     two import lines.
 *  4. The `SearchFilters` type lives in `search.repository.ts`; types are routed the same way.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

function walk(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, exts, results);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function listExports(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const names = new Set();
  const re = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) names.add(m[1]);
  const reConst = /export\s+const\s+([A-Za-z0-9_$]+)/g;
  while ((m = reConst.exec(text)) !== null) names.add(m[1]);
  const reType =
    /export\s+(?:type|interface)\s+([A-Za-z0-9_$]+)/g;
  while ((m = reType.exec(text)) !== null) names.add(m[1]);
  const reClass = /export\s+class\s+([A-Za-z0-9_$]+)/g;
  while ((m = reClass.exec(text)) !== null) names.add(m[1]);
  return names;
}

const repoFiles = walk(
  path.join(featuresDir),
  [".ts"],
  []
).filter((f) => f.includes(`${path.sep}repositories${path.sep}`) && f.endsWith(".repository.ts"));

const symbolToFeature = new Map();
const collisions = [];
for (const repo of repoFiles) {
  const m = repo.match(/[\\/]([a-z-]+)[\\/]repositories[\\/][a-z-]+\.repository\.ts$/);
  if (!m) continue;
  const feature = m[1];
  for (const name of listExports(repo)) {
    if (symbolToFeature.has(name)) {
      collisions.push({ name, a: symbolToFeature.get(name), b: feature });
    } else {
      symbolToFeature.set(name, feature);
    }
  }
}

if (collisions.length) {
  console.error("Symbol collisions detected across features:");
  for (const c of collisions) console.error(`  ${c.name}: ${c.a} vs ${c.b}`);
}

const importRe =
  /import\s*\{([^}]*)\}\s*from\s*(["'])@\/data\2\s*;?/g;

const targets = walk(srcDir, [".ts", ".tsx"], []).filter(
  (f) => !f.endsWith(`${path.sep}data${path.sep}index.ts`) && !f.includes(`${path.sep}repositories${path.sep}`)
);

let totalReplacements = 0;
let filesTouched = 0;
let unresolved = new Set();

for (const file of targets) {
  const text = fs.readFileSync(file, "utf8");
  let changed = false;
  const out = text.replace(importRe, (full, namesRaw, quote) => {
    const names = namesRaw
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const grouped = new Map(); // feature -> names[]
    const missing = [];
    for (const n of names) {
      const base = n.replace(/\s+as\s+.*$/, "").trim();
      const feat = symbolToFeature.get(base);
      if (!feat) {
        missing.push(n);
      } else {
        if (!grouped.has(feat)) grouped.set(feat, []);
        grouped.get(feat).push(n);
      }
    }
    if (missing.length) {
      for (const m of missing) unresolved.add(`${m} in ${file}`);
    }
    if (!grouped.size) return full;
    changed = true;
    const lines = [];
    for (const [feat, syms] of grouped) {
      lines.push(`import { ${syms.join(", ")} } from "@/features/${feat}";`);
    }
    return lines.join("\n");
  });
  if (changed) {
    const count = (text.match(importRe) || []).length;
    fs.writeFileSync(file, out, "utf8");
    totalReplacements += count;
    filesTouched += 1;
  }
}

console.log(`Files touched: ${filesTouched}`);
console.log(`Import lines rewritten: ${totalReplacements}`);
if (unresolved.size) {
  console.log(`Unresolved symbols (${unresolved.size}):`);
  for (const u of unresolved) console.log(`  ${u}`);
}
