#!/usr/bin/env node
/**
 * Phase 17.5 codemod: rewrite cross-feature deep imports
 *   `@/features/<f>/<sub>/<file>` -> `@/features/<f>`
 *
 * Same symbol-to-feature map approach as phase17, but maps each imported
 * symbol to the originating feature.
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
  let m;
  const re1 = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g;
  while ((m = re1.exec(text)) !== null) names.add(m[1]);
  const re2 = /export\s+const\s+([A-Za-z0-9_$]+)/g;
  while ((m = re2.exec(text)) !== null) names.add(m[1]);
  const re3 = /export\s+(?:type|interface)\s+([A-Za-z0-9_$]+)/g;
  while ((m = re3.exec(text)) !== null) names.add(m[1]);
  const re4 = /export\s+class\s+([A-Za-z0-9_$]+)/g;
  while ((m = re4.exec(text)) !== null) names.add(m[1]);
  return names;
}

function featureOf(file) {
  const rel = path.relative(featuresDir, file);
  const segs = rel.split(path.sep);
  if (segs[0] === ".." || !segs[0]) return null;
  if (!fs.existsSync(path.join(featuresDir, segs[0]))) return null;
  return segs[0];
}

const allFiles = walk(srcDir, [".ts", ".tsx"], []);
const repoFiles = allFiles.filter(
  (f) => f.includes(`${path.sep}repositories${path.sep}`) && f.endsWith(".repository.ts")
);

const symbolToFeature = new Map();
const collisions = [];
for (const repo of repoFiles) {
  const feat = featureOf(repo);
  for (const name of listExports(repo)) {
    if (symbolToFeature.has(name) && symbolToFeature.get(name) !== feat) {
      collisions.push({ name, a: symbolToFeature.get(name), b: feat });
    } else {
      symbolToFeature.set(name, feat);
    }
  }
}

const targets = allFiles.filter((f) => {
  if (f.includes(`${path.sep}repositories${path.sep}`)) return false;
  return true;
});

const importRe =
  /import\s*(type\s+)?(\{[^}]*\})\s*from\s*(["'])@\/features\/([a-z0-9-]+)\/([a-z0-9\-./]+)\3\s*;?/g;
const dynRe =
  /import\(\s*(["'])@\/features\/([a-z0-9-]+)\/([a-z0-9\-./]+)\1\s*\)/g;

let total = 0;
let filesTouched = 0;
const unresolved = new Set();

function processImport(file, text) {
  const importerFeature = featureOf(file);
  let changed = false;
  const out = text.replace(importRe, (full, typeKw, body, quote, feat, sub) => {
    if (sub === "index" || sub.endsWith("/index")) return full;
    if (importerFeature === feat) return full;
    if (!body) {
      return full;
    }
    const inner = body.replace(/^\{\s*|\s*\}$/g, "");
    const names = inner
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const grouped = new Map();
    const missing = [];
    for (const n of names) {
      const base = n.replace(/\s+as\s+.*$/, "").trim();
      const f = symbolToFeature.get(base);
      if (!f) {
        missing.push(n);
      } else {
        if (!grouped.has(f)) grouped.set(f, []);
        grouped.get(f).push(n);
      }
    }
    if (missing.length) for (const m of missing) unresolved.add(`${m} in ${file}`);
    if (!grouped.size) return full;
    changed = true;
    const lines = [];
    for (const [f, syms] of grouped) {
      const prefix = typeKw ? "import type { " : "import { ";
      const suffix = typeKw ? " }" : " }";
      lines.push(`${prefix}${syms.join(", ")}${suffix} from "@/features/${f}";`);
    }
    return lines.join("\n");
  });
  if (changed) total += (text.match(importRe) || []).length;
  return { out, changed };
}

function processDynamic(file, text) {
  let changed = false;
  const out = text.replace(dynRe, (full, quote, feat, sub) => {
    if (sub === "index" || sub.endsWith("/index")) return full;
    const importerFeature = featureOf(file);
    if (importerFeature === feat) return full;
    return `import("@/features/${feat}")`;
  });
  if (out !== text) changed = true;
  return { out, changed };
}

for (const file of targets) {
  let text = fs.readFileSync(file, "utf8");
  const a = processImport(file, text);
  text = a.out;
  const b = processDynamic(file, text);
  text = b.out;
  if (a.changed || b.changed) {
    fs.writeFileSync(file, text, "utf8");
    filesTouched += 1;
  }
}

console.log(`Files touched: ${filesTouched}`);
console.log(`Deep imports rewritten: ${total}`);
if (unresolved.size) {
  console.log(`Unresolved symbols (${unresolved.size}):`);
  for (const u of unresolved) console.log(`  ${u}`);
}
if (collisions.length) {
  console.log(`Collisions (${collisions.length}):`);
  for (const c of collisions) console.log(`  ${c.name}: ${c.a} vs ${c.b}`);
}
