#!/usr/bin/env node
/**
 * Robust removal of the // Hooks section from every feature's client
 * barrel. The previous regex failed on whitespace quirks; this one
 * matches the section header and any line that exports something from
 * ./hooks/, until the next section header or end of file.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let updated = 0;
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const barrel = path.join(featuresDir, f.name, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  let text = fs.readFileSync(barrel, "utf8");
  const before = text;
  // Match "// Hooks" header and everything after it that exports from ./hooks/
  text = text.replace(/\n?\/\/ Hooks[\s\S]*?(?=\n\/\/ |\s*$)/m, "\n");
  text = text.replace(/\n?\/\/ Hooks \(removed[\s\S]*?(?=\n\/\/ |\s*$)/m, "\n");
  if (text !== before) {
    fs.writeFileSync(barrel, text, "utf8");
    updated += 1;
  }
}
console.log(`Removed Hooks section from ${updated} client barrels.`);
