#!/usr/bin/env node
/**
 * Regenerate every feature barrel's "Components" section.
 *
 * For each file in src/features/<f>/components/**:
 *   - if it has a `export default` declaration, re-export it as default.
 *   - if it only has named exports, detect the top-level component name
 *     and re-export that name.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

function listFiles(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

function pascal(name) {
  return name
    .replace(/\.(tsx|ts)$/, "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

function findComponentExport(text) {
  const def = text.match(/export\s+default\s+(?:function|class|const)\s+([A-Za-z0-9_$]+)/);
  if (def) return { kind: "default", name: def[1] };
  const namedFn = text.match(/export\s+function\s+([A-Z][A-Za-z0-9_$]*)\s*\(/);
  if (namedFn) return { kind: "named", name: namedFn[1] };
  const namedConst = text.match(/export\s+const\s+([A-Z][A-Za-z0-9_$]*)\s*[:=]/);
  if (namedConst) return { kind: "named", name: namedConst[1] };
  return null;
}

const features = fs
  .readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let updated = 0;
for (const feature of features) {
  const componentsDir = path.join(featuresDir, feature, "components");
  if (!fs.existsSync(componentsDir)) continue;
  const componentFiles = listFiles(componentsDir, [".tsx", ".ts"], []);
  const barrel = path.join(featuresDir, feature, "index.ts");
  let text = fs.existsSync(barrel) ? fs.readFileSync(barrel, "utf8") : "";
  const lines = text.split("\n");
  const startIdx = lines.findIndex((l) => l.startsWith("// Components"));
  const head = startIdx >= 0 ? lines.slice(0, startIdx) : lines;
  const tail = startIdx >= 0 ? lines.slice(startIdx + 1) : [];
  while (head.length && !head[head.length - 1].trim()) head.pop();
  const newHead = head.concat(["", "// Components"]);
  const newLines = [...newHead];
  const seen = new Set();
  for (const f of componentFiles) {
    const rel = path
      .relative(path.join(featuresDir, feature, "components"), f)
      .replace(/\\/g, "/")
      .replace(/\.(tsx|ts)$/, "");
    const baseName = path.basename(rel);
    if (baseName === "index") continue;
    const fileText = fs.readFileSync(f, "utf8");
    const exp = findComponentExport(fileText);
    if (!exp) continue;
    const alias = pascal(baseName);
    if (!/^[A-Za-z_$][\w$]*$/.test(alias)) continue;
    if (seen.has(alias)) continue;
    seen.add(alias);
    if (exp.kind === "default") {
      newLines.push(`export { default as ${alias} } from "./components/${rel}";`);
    } else if (exp.name === alias) {
      newLines.push(`export { ${alias} } from "./components/${rel}";`);
    } else {
      newLines.push(`export { ${exp.name} as ${alias} } from "./components/${rel}";`);
    }
  }
  const filtered = newLines.filter((l) => {
    if (!l.startsWith("export { ")) return true;
    const m = l.match(/as\s+(\w+)\s+\}/);
    if (!m) return true;
    if (seen.has(`__seen_${m[1]}`)) return false;
    seen.add(`__seen_${m[1]}`);
    return true;
  });
  filtered.push(...tail.filter((l) => l.trim() && !l.startsWith("export { ")));
  fs.writeFileSync(barrel, filtered.join("\n").replace(/\n+$/, "\n"), "utf8");
  updated += 1;
}
console.log(`Updated ${updated} barrels.`);
