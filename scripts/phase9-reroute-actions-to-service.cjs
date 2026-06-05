#!/usr/bin/env node
/**
 * Migrate action files to use the feature service layer.
 *
 * Strategy:
 *   1. Parse each action file's `import { ... } from "@/features/<f>/server"`.
 *   2. For each imported name `N`, if `<f>Service` exposes a method named `N`,
 *      remember that this file's "call N" should become "<f>Service.N".
 *      If the name was imported as `N as M`, also remember that `M` is an
 *      alias for that method.
 *   3. Rewrite the import line to use `import { service as <f>Service }`
 *      (deduped) and keep the remaining repo-only names.
 *   4. Rewrite call sites: only the method names that match a tracked
 *      mapping, only at call positions (not declarations).
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const actionsDir = path.join(root, "src", "actions");

// Build map: feature -> set of service methods.
const featureMethods = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const servicesDir = path.join(featuresDir, f.name, "services");
  if (!fs.existsSync(servicesDir)) continue;
  const svcFile = fs.readdirSync(servicesDir).find((x) => x.endsWith(".service.ts"));
  if (!svcFile) continue;
  const text = fs.readFileSync(path.join(servicesDir, svcFile), "utf8");
  const methods = new Set();
  const re = /^\s{2}(?:async\s+)?([a-zA-Z_$][\w$]*)\s*[:(]/gm;
  let m;
  while ((m = re.exec(text)) !== null) methods.add(m[1]);
  featureMethods.set(f.name, methods);
}

function camel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// Regex used both for parsing and rewriting
const importReSrc = String.raw`^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@/features/[a-z0-9-]+/server)["']\s*;?\s*$`;
const importRe = new RegExp(importReSrc, "gm");

let updated = 0;
for (const file of fs.readdirSync(actionsDir).filter((x) => x.endsWith(".ts"))) {
  const fp = path.join(actionsDir, file);
  const orig = fs.readFileSync(fp, "utf8");
  const perFeature = new Map();
  // Fresh regex per file (g flag keeps state across exec() calls)
  const localRe = new RegExp(importReSrc, "gm");
  let m;
  while ((m = localRe.exec(orig)) !== null) {
    const mod = m[3];
    const feature = mod.replace(/^@\/features\//, "").replace(/\/server$/, "");
    const methods = featureMethods.get(feature);
    if (!methods) continue;
    const items = m[2].split(",").map((s) => s.trim()).filter(Boolean);
    const arr = perFeature.get(feature) || { serviceAliases: [], repoOnly: [] };
    for (const item of items) {
      const asMatch = item.match(/^(\w+)\s+as\s+(\w+)$/);
      const method = asMatch ? asMatch[1] : item;
      const alias = asMatch ? asMatch[2] : method;
      if (methods.has(method)) {
        arr.serviceAliases.push({ method, alias });
      } else {
        arr.repoOnly.push(item);
      }
    }
    perFeature.set(feature, arr);
  }
  if (perFeature.size === 0) continue;

  // Replace the original import lines
  const rewriteRe = new RegExp(importReSrc, "gm");
  let workText = orig.replace(rewriteRe, (full, indent, names, mod) => {
    const feature = mod.replace(/^@\/features\//, "").replace(/\/server$/, "");
    if (!featureMethods.has(feature)) return full;
    const info = perFeature.get(feature);
    const alias = `${camel(feature)}Service`;
    const parts = [];
    if (info.serviceAliases.length) {
      parts.push(`${indent}import { service as ${alias} } from "${mod}";`);
    }
    if (info.repoOnly.length) {
      parts.push(`${indent}import { ${info.repoOnly.join(", ")} } from "${mod}";`);
    }
    return parts.join("\n");
  });
  if (workText === orig) continue;
  // Rewrite call sites
  for (const [feature, info] of perFeature) {
    const alias = `${camel(feature)}Service`;
    for (const { method, alias: callName } of info.serviceAliases) {
      const re = new RegExp(`(?<![\\w$.])${callName}\\s*\\(`, "g");
      workText = workText.replace(re, `${alias}.${method}(`);
    }
  }
  fs.writeFileSync(fp, workText, "utf8");
  updated += 1;
}

// Pass 2: combine multiple imports from the same @/features/<f>/server module into one line.
for (const file of fs.readdirSync(actionsDir).filter((x) => x.endsWith(".ts"))) {
  const fp = path.join(actionsDir, file);
  let text = fs.readFileSync(fp, "utf8");
  const before = text;
  const lines = text.split("\n");
  const byModule = new Map();
  const lineMap = new Map();
  const re = new RegExp(importReSrc);
  for (let idx = 0; idx < lines.length; idx++) {
    const m = lines[idx].match(re);
    if (m) {
      const mod = m[3];
      if (!byModule.has(mod)) byModule.set(mod, []);
      byModule.get(mod).push({ indent: m[1], items: m[2].split(",").map((s) => s.trim()).filter(Boolean) });
      lineMap.set(mod, (lineMap.get(mod) || []).concat([idx]));
    }
  }
  for (const [mod, groups] of byModule) {
    if (groups.length < 2) continue;
    const lineIdxs = lineMap.get(mod);
    const firstIdx = lineIdxs[0];
    const indent = groups[0].indent;
    const items = [];
    const seen = new Set();
    for (const g of groups) for (const it of g.items) if (!seen.has(it)) { seen.add(it); items.push(it); }
    const newLine = `${indent}import { ${items.join(", ")} } from "${mod}";`;
    for (let k = lineIdxs.length - 1; k >= 0; k--) lines.splice(lineIdxs[k], 1);
    lines.splice(firstIdx, 0, newLine);
  }
  text = lines.join("\n");
  if (text !== before) fs.writeFileSync(fp, text, "utf8");
}

console.log(`Migrated ${updated} action files to use feature-specific service.`);
