const fs = require("fs");
const fp = "src/actions/enrollment.actions.ts";
const t = fs.readFileSync(fp, "utf8");
const lines = t.split("\n");
const re = /^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/;
const byModule = new Map();
const lineMap = new Map();
for (let idx = 0; idx < lines.length; idx++) {
  const m = lines[idx].match(re);
  if (m) {
    const mod = m[3];
    if (!byModule.has(mod)) byModule.set(mod, []);
    byModule.get(mod).push({ indent: m[1], items: m[2].split(",").map((s) => s.trim()).filter(Boolean) });
    lineMap.set(mod, (lineMap.get(mod) || []).concat([idx]));
  }
}
console.log("byModule size:", byModule.size);
for (const [m, arr] of byModule) {
  console.log(m, "->", JSON.stringify(arr));
  console.log("  lineIdxs:", JSON.stringify(lineMap.get(m)));
}
