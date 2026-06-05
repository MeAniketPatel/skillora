const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");

function walk(dir, exts = [".ts", ".tsx"], out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

const allFiles = walk(srcDir);

// Map of shared file/folder to features that import it
// Let's resolve imports to shared modules
const sharedUsage = {};

// We define shared sub-modules by their first sub-level under src/shared/
// e.g. shared/components, shared/lib, shared/hooks, etc.
allFiles.forEach(file => {
  const rel = path.relative(srcDir, file).replace(/\\/g, "/");
  const featureMatch = rel.match(/^features\/([^/]+)\//);
  if (!featureMatch) return; // Only count imports from features
  
  const featureName = featureMatch[1];
  const content = fs.readFileSync(file, "utf8");
  
  const regex = /from\s*["']@\/shared\/([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const sharedSubPath = match[1];
    // Normalize to first two levels or module name
    const parts = sharedSubPath.split("/");
    const moduleName = parts[0] + (parts[1] ? "/" + parts[1] : "");
    const fullSharedPath = "shared/" + moduleName;
    
    if (!sharedUsage[fullSharedPath]) {
      sharedUsage[fullSharedPath] = new Set();
    }
    sharedUsage[fullSharedPath].add(featureName);
  }
});

console.log("=== Shared Folder Usage by Features ===");
Object.keys(sharedUsage).sort().forEach(sharedPath => {
  const count = sharedUsage[sharedPath].size;
  const featuresList = Array.from(sharedUsage[sharedPath]).join(", ");
  console.log(`${sharedPath}: used by ${count} features [${featuresList}]`);
});
