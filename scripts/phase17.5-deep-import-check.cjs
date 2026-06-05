#!/usr/bin/env node
/**
 * Phase 17.5: deep-import check.
 * Detects imports of @/features/<feature>/<sub>/<file> from outside that feature.
 * Allowed: @/features/<f>/index, @/features/<f>/<sub>/* when the importer is in the same feature.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");
const featuresDir = path.join(srcDir, "features");

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

const files = walk(srcDir, [".ts", ".tsx"], []);

function featureOf(file) {
  const rel = path.relative(featuresDir, file);
  const segs = rel.split(path.sep);
  if (segs[0] === ".." || !segs[0] || !fs.existsSync(path.join(featuresDir, segs[0]))) {
    return null;
  }
  return segs[0];
}

const re = /from\s+["']@\/features\/([a-z0-9-]+)(?:\/([^"']+))?["']/g;
const reDyn = /import\(\s*["']@\/features\/([a-z0-9-]+)(?:\/([^"']+))?["']\s*\)/g;

let violations = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const importerFeature = featureOf(file);
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(line)) !== null) {
      const targetFeature = m[1];
      const sub = m[2] || "";
      if (!sub || sub === "index" || sub.endsWith("/index")) continue;
      if (importerFeature === targetFeature) continue;
      console.log(`${path.relative(root, file)}:${idx + 1}: ${line.trim()}`);
      violations += 1;
    }
    reDyn.lastIndex = 0;
    while ((m = reDyn.exec(line)) !== null) {
      const targetFeature = m[1];
      const sub = m[2] || "";
      if (!sub || sub === "index" || sub.endsWith("/index")) continue;
      if (importerFeature === targetFeature) continue;
      console.log(`${path.relative(root, file)}:${idx + 1}: ${line.trim()}`);
      violations += 1;
    }
  });
}

if (violations === 0) {
  console.log("OK: no cross-feature deep imports detected.");
} else {
  console.log(`FAIL: ${violations} cross-feature deep import(s) detected.`);
  process.exit(1);
}
