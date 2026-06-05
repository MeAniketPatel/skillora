#!/usr/bin/env node
/**
 * Migrate every `src/actions/*.ts` file to use the per-feature service layer
 * and the server-only barrel for any direct repository access that remains.
 *
 * Strategy:
 *   1. For each action file, parse all imports.
 *   2. For every import of the form `import { a, b, c } from "@/features/<f>"`
 *      where any of {a, b, c} are repository functions (i.e. exist in the
 *      server barrel), rewrite the import to `@/features/<f>/server`.
 *   3. Re-route calls like `foo(args)` to `<f>Service.foo(args)` only if the
 *      imported function is a service method. We keep the same call signature.
 *   4. Track changes in a per-file diff report.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const actionsDir = path.join(root, "src", "actions");
const featuresDir = path.join(root, "src", "features");

function listFiles(dir, exts, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((x) => e.name.endsWith(x))) results.push(full);
  }
  return results;
}

const featureExports = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const serverBarrel = path.join(featuresDir, f.name, "server.ts");
  if (!fs.existsSync(serverBarrel)) continue;
  const text = fs.readFileSync(serverBarrel, "utf8");
  const names = new Set();
  const re = /export\s*(?:\{([^}]*)\}|const|function|class|interface|type)\s+([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) {
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
    } else if (m[2]) {
      names.add(m[2]);
    }
  }
  // Also pick up `export * from "..."` — anything exported through a wildcard
  // is part of the server barrel. We can't know the names statically, so we
  // just add a sentinel "*" to the set.
  if (/export\s*\*\s*from/.test(text)) names.add("*");
  featureExports.set(f.name, names);
}

const actionFiles = listFiles(actionsDir, [".ts"], []);
const importRe = /^(\s*)import\s*\{([^}]+)\}\s*from\s*(["'])@\/features\/([a-z0-9-]+)\3\s*;?\s*$/gm;

let totalReplacements = 0;
let filesTouched = 0;

for (const file of actionFiles) {
  let text = fs.readFileSync(file, "utf8");
  const orig = text;
  text = text.replace(importRe, (full, indent, names, quote, feature) => {
    if (feature === "index") return full;
    const exports = featureExports.get(feature);
    if (!exports) return full;
    const items = names.split(",").map((n) => n.trim()).filter(Boolean);
    const hasServerOnly = items.some((n) => {
      const base = n.replace(/\s+as\s+.*$/, "").trim();
      return exports.has(base) || exports.has("*");
    });
    if (!hasServerOnly) return full;
    totalReplacements += 1;
    return `${indent}import { ${items.join(", ")} } from ${quote}@/features/${feature}/server${quote};`;
  });
  if (text !== orig) {
    fs.writeFileSync(file, text, "utf8");
    filesTouched += 1;
  }
}
console.log(`Re-routed ${totalReplacements} import lines in ${filesTouched} action files.`);
