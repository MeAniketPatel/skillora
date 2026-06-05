#!/usr/bin/env node
/**
 * Remove duplicate `import { z } from "zod"` lines (and similar duplicate
 * imports) in feature contract files. Uses a content-based dedupe on the
 * full text line, not strict equality.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let cleaned = 0;
function dedupeImports(text) {
  const lines = text.split("\n");
  const seen = new Set();
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*["']([^"']+)["']\s*;?\s*$/);
    if (m) {
      const key = `${m[1]}|${m[3]}|${m[2].replace(/\s+/g, "").split(",").sort().join(",")}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    out.push(line);
  }
  return out.join("\n");
}

for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const contractsDir = path.join(featuresDir, f.name, "contracts");
  if (!fs.existsSync(contractsDir)) continue;
  for (const c of fs.readdirSync(contractsDir)) {
    if (!c.endsWith(".contract.ts")) continue;
    const fp = path.join(contractsDir, c);
    const text = fs.readFileSync(fp, "utf8");
    const cleaned_text = dedupeImports(text);
    if (cleaned_text !== text) {
      fs.writeFileSync(fp, cleaned_text, "utf8");
      cleaned += 1;
    }
  }
}
console.log(`Deduplicated imports in ${cleaned} contract files.`);
