#!/usr/bin/env node
/**
 * Sync the Contracts section of each feature's index.ts to the actual
 * exports of the feature's primary contract file. Drops mismatched names.
 * Also removes the duplicate `import { z } from "zod"` introduced by the
 * migration codemod.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let fixed = 0;
let barrelsRegenerated = 0;

for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  // Find the primary contract: <feature>.contract.ts
  const primary = path.join(contractsDir, `${f.name}.contract.ts`);
  if (!fs.existsSync(primary)) continue;

  // Gather actual exports
  const text = fs.readFileSync(primary, "utf8");
  const schemaNames = [];
  const typeNames = [];
  const re = /export\s+(?:const|function|interface|enum)\s+(\w+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (/Schema|Query/.test(m[1])) schemaNames.push(m[1]);
  }
  const typeRe = /export\s+type\s+(\w+)/g;
  while ((m = typeRe.exec(text)) !== null) {
    typeNames.push(m[1]);
  }

  // Fix duplicate z imports
  let primaryText = text;
  if ((primaryText.match(/^import\s*\{[^}]*\}\s*from\s*["']zod["'];?$/gm) || []).length > 1) {
    const lines = primaryText.split("\n");
    const seen = new Set();
    const cleaned = lines.filter((l) => {
      if (/^import\s*\{[^}]*\}\s*from\s*["']zod["'];?$/.test(l)) {
        if (seen.has(l)) return false;
        seen.add(l);
      }
      return true;
    });
    primaryText = cleaned.join("\n");
    fs.writeFileSync(primary, primaryText, "utf8");
    fixed += 1;
  }

  // Sync barrel
  const barrel = path.join(featuresDir, f.name, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  let barrelText = fs.readFileSync(barrel, "utf8");
  const before = barrelText;
  // Replace the Contracts section: match "// Contracts" through the next blank line + section header or end
  const sectionRe = /\/\/ Contracts\s*\n(?:[^\n]*\n)*?(?=\n\/\/ |\s*$)/m;
  const schemaExports = schemaNames.length
    ? `export { ${schemaNames.join(", ")} } from "./contracts/${f.name}.contract";`
    : null;
  const typeExports = typeNames.length
    ? `export type { ${typeNames.join(", ")} } from "./contracts/${f.name}.contract";`
    : null;
  const newSection = [schemaExports, typeExports].filter(Boolean).join("\n");
  if (sectionRe.test(barrelText) && newSection) {
    barrelText = barrelText.replace(sectionRe, "// Contracts\n" + newSection + "\n");
  } else if (newSection) {
    barrelText += "\n// Contracts\n" + newSection + "\n";
  }
  if (barrelText !== before) {
    fs.writeFileSync(barrel, barrelText, "utf8");
    barrelsRegenerated += 1;
  }
}
console.log(`Fixed ${fixed} duplicate z imports; regenerated ${barrelsRegenerated} barrels.`);
