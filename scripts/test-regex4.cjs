const fs = require("fs");
const text = fs.readFileSync("src/actions/enrollment.actions.ts", "utf8");
const re = /^(\s*)import\s*\{([^}]+)\}\s*from\s*["'](@\/features\/[a-z0-9-]+\/server)["']\s*;?\s*$/gm;
let m;
let count = 0;
while ((m = re.exec(text)) !== null) {
  count++;
  console.log(`match ${count}:`, m[0]);
  console.log(`  mod:`, m[3]);
}
console.log(`Total matches: ${count}`);
