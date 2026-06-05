const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");
const featuresDir = path.join(srcDir, "features");

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

// Map: featureName -> subpath -> { symbols: Set, typeSymbols: Set }
const barrelExports = {};

function addBarrelExport(feature, subpath, symbol, isTypeOnly) {
  if (!barrelExports[feature]) barrelExports[feature] = {};
  if (!barrelExports[feature][subpath]) {
    barrelExports[feature][subpath] = { symbols: new Set(), typeSymbols: new Set() };
  }
  if (isTypeOnly) {
    barrelExports[feature][subpath].typeSymbols.add(symbol);
  } else {
    barrelExports[feature][subpath].symbols.add(symbol);
  }
}

// Regex to capture imports from @/features/...
// matches: import { a, b } from "@/features/feat/sub/path"
// matches: import type { a } from "@/features/feat/sub/path"
const importRegex = /import\s+(type\s+)?(?:\{\s*([^}]+)\s*\}|([A-Za-z0-9_$]+))\s+from\s+["']@\/features\/([^"'/]+)\/([^"']+)["']/g;

// First pass: scan all files for deep cross-feature imports
allFiles.forEach(file => {
  const relFile = path.relative(srcDir, file).replace(/\\/g, "/");
  const importerFeature = relFile.startsWith("features/") ? relFile.split("/")[1] : null;

  // Skip feature index.ts files so we don't parse our own barrels recursively
  if (path.basename(file) === "index.ts" && relFile.startsWith("features/")) {
    return;
  }

  const content = fs.readFileSync(file, "utf8");
  let match;
  importRegex.lastIndex = 0;

  while ((match = importRegex.exec(content)) !== null) {
    const isTypeKeyword = !!match[1];
    const curlySymbols = match[2];
    const defaultSymbol = match[3];
    const targetFeature = match[4];
    const subpath = match[5];

    // If importing from the same feature, deep import is allowed. Skip.
    if (importerFeature === targetFeature) {
      continue;
    }

    // Skip if importing index barrel itself
    if (subpath === "index" || subpath.endsWith("/index")) {
      continue;
    }

    // Get all imported symbols
    const symbols = [];
    if (curlySymbols) {
      curlySymbols.split(",").forEach(s => {
        const trimmed = s.trim();
        if (trimmed) {
          // handles "as" renaming, e.g., "createCategory as cc" -> we need "createCategory"
          const baseSymbol = trimmed.split(/\s+as\s+/)[0].trim();
          symbols.push(baseSymbol);
        }
      });
    } else if (defaultSymbol) {
      symbols.push(defaultSymbol);
    }

    symbols.forEach(sym => {
      addBarrelExport(targetFeature, subpath, sym, isTypeKeyword);
    });
  }
});

// Second pass: Update feature index.ts barrels with the required exports
Object.keys(barrelExports).forEach(feature => {
  const barrelPath = path.join(featuresDir, feature, "index.ts");
  if (!fs.existsSync(barrelPath)) {
    console.log(`Creating barrel file for ${feature}`);
    fs.writeFileSync(barrelPath, "", "utf8");
  }

  let barrelContent = fs.readFileSync(barrelPath, "utf8");
  const subpaths = barrelExports[feature];

  Object.keys(subpaths).forEach(sub => {
    const { symbols, typeSymbols } = subpaths[sub];
    
    // Construct the relative path for the export (e.g. "./actions/category.actions")
    // If the import was @/features/feat/actions/category.actions, sub is "actions/category.actions"
    const relativeExportPath = "./" + sub;

    // Read the actual exported file to see if we're dealing with types or values
    // We will append them to index.ts
    const exportsToAppend = [];
    
    if (symbols.size > 0) {
      // Find which ones are already exported in barrelContent to avoid duplicates
      const missing = [];
      symbols.forEach(sym => {
        // regex checking for export { ... sym ... } or export * or export { sym }
        const regex = new RegExp(`\\bexport\\s+\\{[^}]*\\b${sym}\\b[^}]*\\}\\s+from\\s+["']\\.\\/${sub}["']`);
        const regexGeneral = new RegExp(`\\bexport\\s+\\{[^}]*\\b${sym}\\b`);
        if (!regex.test(barrelContent) && !regexGeneral.test(barrelContent)) {
          missing.push(sym);
        }
      });
      if (missing.length > 0) {
        exportsToAppend.push(`export { ${missing.join(", ")} } from "${relativeExportPath}";`);
      }
    }

    if (typeSymbols.size > 0) {
      const missingTypes = [];
      typeSymbols.forEach(sym => {
        const regex = new RegExp(`\\bexport\\s+(type\\s+)?\\{[^}]*\\b${sym}\\b[^}]*\\}\\s+from\\s+["']\\.\\/${sub}["']`);
        const regexGeneral = new RegExp(`\\bexport\\s+(type\\s+)?\\{[^}]*\\b${sym}\\b`);
        if (!regex.test(barrelContent) && !regexGeneral.test(barrelContent)) {
          missingTypes.push(sym);
        }
      });
      if (missingTypes.length > 0) {
        exportsToAppend.push(`export type { ${missingTypes.join(", ")} } from "${relativeExportPath}";`);
      }
    }

    if (exportsToAppend.length > 0) {
      barrelContent += "\n" + exportsToAppend.join("\n") + "\n";
    }
  });

  fs.writeFileSync(barrelPath, barrelContent, "utf8");
});

// Third pass: Rewrite imports in all files to use the feature barrels
let rewrittenCount = 0;
allFiles.forEach(file => {
  const relFile = path.relative(srcDir, file).replace(/\\/g, "/");
  const importerFeature = relFile.startsWith("features/") ? relFile.split("/")[1] : null;

  if (path.basename(file) === "index.ts" && relFile.startsWith("features/")) {
    return;
  }

  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // Let's replace line-by-line or using regex. A line-by-line replacement is safer.
  const lines = content.split("\n");
  const newLines = lines.map(line => {
    // Check if line matches deep import pattern
    const match = line.match(/import\s+(type\s+)?(\{[^}]*\}|[A-Za-z0-9_$]+)\s+from\s+["']@\/features\/([^"'/]+)\/([^"']+)["']/);
    if (match) {
      const isType = match[1] || "";
      const imports = match[2];
      const targetFeature = match[3];
      const subpath = match[4];

      if (importerFeature !== targetFeature && subpath !== "index" && !subpath.endsWith("/index")) {
        changed = true;
        rewrittenCount++;
        // Rewrite import to feature barrel
        return `import ${isType}${imports} from "@/features/${targetFeature}";`;
      }
    }
    return line;
  });

  if (changed) {
    fs.writeFileSync(file, newLines.join("\n"), "utf8");
  }
});

console.log(`Completed refactoring deep imports.`);
console.log(`Rewrote ${rewrittenCount} import declarations.`);
