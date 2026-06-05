#!/usr/bin/env node
/**
 * Codemod: move all `src/components/<domain>/...` files into
 * `src/features/<feature>/components/...`, rewrite imports, and append
 * the components to the corresponding feature barrel.
 *
 * Domain -> feature map (single source of truth for this migration).
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const componentsDir = path.join(root, "src", "components");
const featuresDir = path.join(root, "src", "features");
const srcDir = path.join(root, "src");

const DOMAIN_TO_FEATURE = {
  admin: "admin",
  blog: "blog",
  cart: "cart",
  chat: "chat",
  "code-playground": "code-playground",
  contact: "contact",
  course: "courses",
  discussion: "discussions",
  flashcard: "flashcards",
  gamification: "gamification",
  learn: "learn",
  "learning-path": "learning-paths",
  marketing: "marketing",
  notifications: "notifications",
  poll: "polls",
  profile: "social",
  referral: "referrals",
  settings: "settings",
  student: "students",
  "study-group": "study-groups",
  teacher: "teachers",
};

function ensureFeature(feature) {
  const dirs = [
    path.join(featuresDir, feature, "components"),
    path.join(featuresDir, feature, "services"),
    path.join(featuresDir, feature, "permissions"),
    path.join(featuresDir, feature, "contracts"),
    path.join(featuresDir, feature, "hooks"),
    path.join(featuresDir, feature, "repositories"),
  ];
  for (const d of dirs) fs.mkdirSync(d, { recursive: true });
  const barrel = path.join(featuresDir, feature, "index.ts");
  if (!fs.existsSync(barrel)) {
    fs.writeFileSync(
      barrel,
      `// ${feature} feature barrel\nexport * from "./repositories";\n`,
      "utf8"
    );
  }
}

function listFiles(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

const allComponentFiles = listFiles(componentsDir, [".tsx", ".ts"], []);
const moveMap = new Map();
for (const file of allComponentFiles) {
  const rel = path.relative(componentsDir, file);
  const segs = rel.split(path.sep);
  const domain = segs[0];
  const feature = DOMAIN_TO_FEATURE[domain];
  if (!feature) {
    console.warn(`SKIP: unknown domain ${domain} (${rel})`);
    continue;
  }
  ensureFeature(feature);
  const rest = segs.slice(1).join(path.sep);
  const dest = path.join(featuresDir, feature, "components", rest);
  moveMap.set(file, dest);
}

for (const [src, dest] of moveMap) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
for (const src of moveMap.keys()) {
  fs.rmSync(src, { force: true });
}

for (const empty of fs.readdirSync(componentsDir, { withFileTypes: true })) {
  if (empty.isDirectory()) {
    const sub = path.join(componentsDir, empty.name);
    try {
      fs.rmdirSync(sub);
    } catch {}
  }
}
try {
  fs.rmdirSync(componentsDir);
} catch {}

const importRe = /(import\s+(?:type\s+)?\{[^}]*\}\s+from\s+|import\s+(?:type\s+)?\w+\s+from\s+)(["'])@\/components\/([^"']+)\2/g;
const dynRe = /import\(\s*(["'])@\/components\/([^"']+)\1\s*\)/g;

const targets = listFiles(srcDir, [".ts", ".tsx"], []);
let importReplacements = 0;
let filesTouched = 0;

function featureForComponentPath(p) {
  const segs = p.split("/");
  const domain = segs[0];
  return DOMAIN_TO_FEATURE[domain];
}

for (const file of targets) {
  let text = fs.readFileSync(file, "utf8");
  let changed = false;
  text = text.replace(importRe, (full, prefix, quote, sub) => {
    const feature = featureForComponentPath(sub);
    if (!feature) return full;
    importReplacements += 1;
    changed = true;
    return `${prefix}${quote}@/features/${feature}${quote}`;
  });
  text = text.replace(dynRe, (full, quote, sub) => {
    const feature = featureForComponentPath(sub);
    if (!feature) return full;
    importReplacements += 1;
    changed = true;
    return `import(${quote}@/features/${feature}${quote})`;
  });
  if (changed) {
    fs.writeFileSync(file, text, "utf8");
    filesTouched += 1;
  }
}

const componentExportsByFeature = new Map();
for (const dest of moveMap.values()) {
  const rel = path.relative(featuresDir, dest);
  const segs = rel.split(path.sep);
  const feature = segs[0];
  if (!componentExportsByFeature.has(feature))
    componentExportsByFeature.set(feature, []);
  componentExportsByFeature.get(feature).push(dest);
}

for (const [feature, files] of componentExportsByFeature) {
  const barrel = path.join(featuresDir, feature, "index.ts");
  let barrelText = fs.existsSync(barrel)
    ? fs.readFileSync(barrel, "utf8")
    : `// ${feature} feature barrel\nexport * from "./repositories";\n`;
  if (!barrelText.includes("// Components")) {
    barrelText += "\n// Components\n";
  }
  for (const f of files) {
    const rel = path
      .relative(path.join(featuresDir, feature), f)
      .replace(/\\/g, "/")
      .replace(/\.(tsx|ts)$/, "");
    const nameMatch = path.basename(f).match(/^([a-z0-9-]+)/);
    const name = nameMatch
      ? nameMatch[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      : path.basename(f, path.extname(f));
    const line = `export { default as ${name} } from "./components/${rel}";\n`;
    if (!barrelText.includes(line)) barrelText += line;
  }
  fs.writeFileSync(barrel, barrelText, "utf8");
}

console.log(`Files moved: ${moveMap.size}`);
console.log(`Import lines rewritten: ${importReplacements}`);
console.log(`Files touched: ${filesTouched}`);
console.log(`Features affected: ${componentExportsByFeature.size}`);
