#!/usr/bin/env node
/**
 * Re-export the repository functions (not just types) in each feature's
 * server barrel. The auto-generated barrels only re-exported TYPES from
 * repositories; the actual functions (getUserById, updateUser, etc.) were
 * lost. This script re-introduces them as named re-exports.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

function listFiles(dir, exts, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) listFiles(path.join(dir, e.name), exts, results);
    else if (exts.some((x) => e.name.endsWith(x))) results.push(path.join(dir, e.name));
  }
  return results;
}

function getRepoFunctions(repoFile) {
  const text = fs.readFileSync(repoFile, "utf8");
  const out = [];
  const re = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
}

const features = fs.readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let updated = 0;
for (const feature of features) {
  const repoDir = path.join(featuresDir, feature, "repositories");
  if (!fs.existsSync(repoDir)) continue;
  const repoFiles = listFiles(repoDir, [".ts"], []).filter((f) => f.endsWith(".repository.ts"));
  if (repoFiles.length === 0) continue;
  const serverBarrel = path.join(featuresDir, feature, "server.ts");
  let serverText = fs.existsSync(serverBarrel) ? fs.readFileSync(serverBarrel, "utf8") : "// Server-only barrel.\n";
  // Check if we already have a `// Repository functions` section
  if (!serverText.includes("// Repository functions")) {
    const additions = ["", "// Repository functions"];
    for (const repo of repoFiles) {
      const base = path.basename(repo, ".repository.ts");
      const rel = `./repositories/${base}.repository`;
      const fns = getRepoFunctions(repo);
      if (fns.length === 0) continue;
      additions.push(`export { ${fns.join(", ")} } from "${rel}";`);
    }
    if (additions.length > 2) {
      serverText += additions.join("\n") + "\n";
      fs.writeFileSync(serverBarrel, serverText, "utf8");
      updated += 1;
    }
  }
}
console.log(`Updated ${updated} server barrels with function re-exports.`);
