const fs = require("fs");
const path = require("path");

function list(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) list(path.join(dir, e.name), results);
    else if (e.name === "index.ts") results.push(path.join(dir, e.name));
  }
  return results;
}

const root = path.join(process.cwd(), "src", "features");
for (const f of list(root)) {
  let text = fs.readFileSync(f, "utf8");
  const updated = text.replace(/, \w+QueryKeys/g, "").replace(/\{ \w+QueryKeys,/g, "{ ");
  if (updated !== text) fs.writeFileSync(f, updated, "utf8");
}
console.log("Cleaned.");
