const fs = require("fs");
const t = fs.readFileSync("src/actions/enrollment.actions.ts", "utf8");
const lines = t.split("\n");
const re = /^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/;
for (let i = 10; i < 14; i++) {
  console.log(JSON.stringify(lines[i]), "=>", re.test(lines[i]));
  const m = lines[i].match(re);
  if (m) console.log("  groups:", JSON.stringify({ a: m[1], b: m[2], c: m[3] }));
}
