#!/usr/bin/env node
/**
 * Fix imports that use the bare '@/validations' alias (the index). Map each
 * imported name back to its feature's contract.
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

// Build map: name -> feature (scan all contracts)
const nameToFeature = new Map();
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  for (const c of fs.readdirSync(contractsDir)) {
    if (!c.endsWith(".contract.ts")) continue;
    const text = fs.readFileSync(path.join(contractsDir, c), "utf8");
    const re = /export\s+(?:const|function|type|interface|enum)\s+(\w+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      nameToFeature.set(m[1], f.name);
    }
  }
}

const re = /import\s*\{([^}]+)\}\s*from\s*["']@\/validations["']/g;
let rewrites = 0;
for (const f of walk(srcDir, [".ts", ".tsx"], [])) {
  let text = fs.readFileSync(f, "utf8");
  const before = text;
  text = text.replace(re, (full, names) => {
    const items = names.split(",").map((s) => s.trim()).filter(Boolean);
    const grouped = new Map();
    for (const item of items) {
      const cleanName = item.replace(/\s+as\s+.*$/, "").trim();
      const feature = nameToFeature.get(cleanName);
      if (!feature) continue;
      if (!grouped.has(feature)) grouped.set(feature, []);
      grouped.get(feature).push(item);
    }
    return Array.from(grouped.entries())
      .map(([feature, list]) => `import { ${list.join(", ")} } from "@/features/${feature}/contracts/${feature}.contract";`)
      .join("\n");
  });
  if (text !== before) {
    fs.writeFileSync(f, text, "utf8");
    rewrites += 1;
  }
}
console.log(`Rewrote ${rewrites} files importing bare '@/validations'.`);
