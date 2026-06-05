#!/usr/bin/env node
/**
 * Clean up broken `export { service };` lines and any duplicate service
 * re-exports in feature server barrels. The previous run left orphan
 * exports without the corresponding import.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

let cleaned = 0;
for (const f of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!f.isDirectory()) continue;
  const sb = path.join(featuresDir, f.name, "server.ts");
  if (!fs.existsSync(sb)) continue;
  let text = fs.readFileSync(sb, "utf8");
  const before = text;
  // Remove `export { service };` lines that have no matching import above
  text = text.replace(/^export\s*\{\s*service\s*\};\s*$/gm, (line, offset) => {
    const above = text.substring(0, offset);
    if (/import\s*\{[^}]*\bas\s+service\b/.test(above)) return line; // keep
    return ""; // drop
  });
  // Deduplicate identical import + export blocks
  const lines = text.split("\n");
  const seen = new Set();
  const out = [];
  for (const l of lines) {
    const key = l.trim();
    if (key === "export { service };" || /^import\s*\{[^}]*\bas\s+service\b/.test(key)) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    out.push(l);
  }
  text = out.join("\n");
  if (text !== before) {
    fs.writeFileSync(sb, text, "utf8");
    cleaned += 1;
  }
}
console.log(`Cleaned ${cleaned} server barrels.`);
