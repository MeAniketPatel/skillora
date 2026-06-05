#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

const allFiles = walk(path.join(root, "src"), [".ts", ".tsx"]);
let text = "";
for (const f of allFiles) {
  try { text += fs.readFileSync(f, "utf8") + "\n"; } catch {}
}
console.log("text size:", text.length);
console.log("contains test:", text.includes("@/features/auth/contracts/auth.contract"));

const contractFiles = walk(featuresDir, [".contract.ts"]);
let used = 0;
let unused = [];
for (const cf of contractFiles) {
  const rel = "@/" + path.relative(root, cf).replace(/\\/g, "/").replace(/^src\//, "");
  // Check whether any file imports from this exact contract path OR from
  // a parent path that aggregates this contract.
  const ok = text.includes(`from "${rel}"`) || text.includes(`from '${rel}'`);
  if (ok) {
    used += 1;
  } else {
    unused.push(rel);
  }
}
if (unused.length > 0 && unused.length < 5) {
  console.log("Sample rel:", JSON.stringify(unused[0]));
  console.log("Looking for:", JSON.stringify(`from "${unused[0]}"`));
  console.log("Found in text:", text.includes(`from "${unused[0]}"`));
}
console.log(`Used: ${used}/${contractFiles.length}`);
console.log("Unused contracts:");
for (const u of unused) console.log("  " + u);
