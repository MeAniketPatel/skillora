const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");

// Build dependency graph
const graph = {};

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

allFiles.forEach(file => {
  const rel = path.relative(srcDir, file).replace(/\\/g, "/");
  const content = fs.readFileSync(file, "utf8");
  const imports = [];
  
  // Regex to match imports: import ... from "..." or import "..."
  const regex = /from\s*["'](@\/[^"']+)["']|import\s*["'](@\/[^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    if (importPath) {
      imports.push(importPath);
    }
  }
  graph[rel] = imports;
});

// Resolve @/ aliases to relative paths in src
function resolveImport(imp, currentFile) {
  if (imp.startsWith("@/")) {
    const relativePart = imp.slice(2);
    // Find matching file in src
    // Try as a file
    const tryFile = relativePart + ".ts";
    if (graph[tryFile]) return tryFile;
    const tryFileX = relativePart + ".tsx";
    if (graph[tryFileX]) return tryFileX;
    // Try as index.ts in folder
    const tryIndex = relativePart + "/index.ts";
    if (graph[tryIndex]) return tryIndex;
    const tryIndexX = relativePart + "/index.tsx";
    if (graph[tryIndexX]) return tryIndexX;
    // Try to match anything starting with this prefix
    const keys = Object.keys(graph);
    const matched = keys.find(k => k.startsWith(relativePart + "/"));
    if (matched) return matched;
  }
  return null;
}

// Find cycles
const cycles = [];
const visited = {};
const stack = {};

function dfs(node) {
  visited[node] = true;
  stack[node] = true;
  
  const imports = graph[node] || [];
  for (const imp of imports) {
    const resolved = resolveImport(imp, node);
    if (!resolved) continue;
    
    if (!visited[resolved]) {
      if (dfs(resolved)) {
        return true;
      }
    } else if (stack[resolved]) {
      // Found a cycle
      // trace back cycle
      cycles.push([node, resolved]);
      return true;
    }
  }
  
  stack[node] = false;
  return false;
}

Object.keys(graph).forEach(node => {
  if (!visited[node]) {
    dfs(node);
  }
});

console.log("=== Circular Dependencies ===");
if (cycles.length === 0) {
  console.log("None found!");
} else {
  console.log(`Found ${cycles.length} cycles:`);
  cycles.forEach(c => {
    console.log(`Cycle: ${c[0]} -> ${c[1]}`);
  });
}
