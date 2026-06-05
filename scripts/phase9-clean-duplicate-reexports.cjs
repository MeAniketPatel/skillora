#!/usr/bin/env node
/**
 * Remove duplicate re-export blocks that were appended by
 * phase9-migrate-validations.cjs to existing hand-written contract files.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let cleaned = 0;
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  for (const c of fs.readdirSync(contractsDir)) {
    if (!c.endsWith(".contract.ts")) continue;
    const fp = path.join(contractsDir, c);
    let text = fs.readFileSync(fp, "utf8");
    const marker = "// Re-exported from legacy src/validations/";
    if (!text.includes(marker)) continue;
    const idx = text.indexOf(marker);
    text = text.substring(0, idx).replace(/\n+$/, "\n");
    fs.writeFileSync(fp, text, "utf8");
    cleaned += 1;
  }
}
console.log(`Cleaned ${cleaned} contract files.`);
