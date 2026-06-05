const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");

// Helper to walk directory recursively
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

// 1. Feature counts
const featuresDir = path.join(srcDir, "features");
const features = fs.existsSync(featuresDir) 
  ? fs.readdirSync(featuresDir).filter(f => fs.statSync(path.join(featuresDir, f)).isDirectory())
  : [];

let reposCount = 0;
let servicesCount = 0;
let contractsCount = 0;
let permissionsCount = 0;
let storesCount = 0;
let eventFilesCount = 0;
let barrelFilesCount = 0;

const serviceFiles = [];
const repFiles = [];

// Count occurrences in feature subfolders
allFiles.forEach(f => {
  const rel = path.relative(srcDir, f).replace(/\\/g, "/");
  
  if (rel.startsWith("features/")) {
    const parts = rel.split("/");
    if (parts.length > 2) {
      const subfolder = parts[2];
      if (subfolder === "repositories") reposCount++;
      if (subfolder === "services") {
        servicesCount++;
        serviceFiles.push(f);
      }
      if (subfolder === "contracts") contractsCount++;
      if (subfolder === "permissions") permissionsCount++;
      if (subfolder === "stores") storesCount++;
    }
  }
  
  // Count event files
  if (rel.startsWith("shared/events/") || rel.startsWith("core/events/")) {
    eventFilesCount++;
  }
  
  // Count barrels
  if (path.basename(f) === "index.ts") {
    barrelFilesCount++;
  }
});

console.log("=== Metrics ===");
console.log(`Features Count: ${features.length}`);
console.log(`Repositories Count: ${reposCount}`);
console.log(`Services Count: ${servicesCount}`);
console.log(`Contracts Count: ${contractsCount}`);
console.log(`Permission Files Count: ${permissionsCount}`);
console.log(`Stores Count: ${storesCount}`);
console.log(`Event Count: ${eventFilesCount}`);
console.log(`Barrel Files Count: ${barrelFilesCount}`);

// 2. Scan for Violations
let prismaViolations = [];
let roleChecksViolations = [];
let reactQueryViolations = [];
let coreViolations = [];
let deepImportViolations = [];

allFiles.forEach(f => {
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const content = fs.readFileSync(f, "utf8");

  // A. prisma.$transaction
  // Allowed ONLY inside services (features/*/services/*)
  if (content.includes(".$transaction") || content.includes(".prisma.$transaction")) {
    const isService = rel.includes("/services/");
    if (!isService) {
      prismaViolations.push(rel);
    }
  }

  // B. inline session.user.role / role checks inside pages/actions
  // Let's search for "session.user.role" or "session?.user?.role" or "user.role === " or "role === '"
  // in src/app or features/*/actions
  if (rel.startsWith("src/app/") || rel.includes("/actions/")) {
    if (content.includes("session?.user?.role") || content.includes("session.user.role") || (content.includes(".role === '") && !rel.includes("/permissions/"))) {
      roleChecksViolations.push(rel);
    }
  }

  // C. useQuery or useMutation outside features/*/hooks/
  // Allowed ONLY in features/*/hooks/ (and shared/hooks if any, but rule says hooks only)
  // Let's check if it's imported from '@tanstack/react-query' or 'useQuery' is used
  if (content.includes("useQuery") || content.includes("useMutation")) {
    const isAllowedHook = rel.includes("/hooks/");
    if (!isAllowedHook) {
      reactQueryViolations.push(rel);
    }
  }

  // D. Core layer forbidden contents
  // Core: Enrollment, Certificate, Course, Payment, Student, Teacher
  if (rel.startsWith("src/core/")) {
    const lower = content.toLowerCase();
    const forbidden = ["enrollment", "certificate", "course", "payment", "student", "teacher"];
    forbidden.forEach(word => {
      // Look for imports or class definitions of forbidden terms in core
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(content)) {
        coreViolations.push(`${rel} (matches word: ${word})`);
      }
    });
  }

  // E. Deep imports: @/features/<feature>/components/* etc.
  // We can look at imports in all files
  const importLines = content.split("\n").filter(line => line.includes("from '") || line.includes("from \"") || line.includes("import '") || line.includes("import \""));
  importLines.forEach(line => {
    const match = line.match(/@\/features\/([^/]+)\/(components|actions|repositories|services|contracts|permissions|hooks|stores|constants|types|utils)\//);
    if (match) {
      // Check if importing from the same feature
      const featureName = match[1];
      const currentFeatureMatch = rel.match(/src\/features\/([^/]+)\//);
      if (!currentFeatureMatch || currentFeatureMatch[1] !== featureName) {
        deepImportViolations.push({ file: rel, line: line.trim() });
      }
    }
  });
});

console.log("\n=== Prisma Violations (should be inside services only) ===");
console.log(prismaViolations);

console.log("\n=== Role Checks Violations ===");
console.log(roleChecksViolations);

console.log("\n=== React Query Violations ===");
console.log(reactQueryViolations);

console.log("\n=== Core Layer Violations ===");
console.log(coreViolations);

console.log("\n=== Deep Import Violations ===");
console.log(deepImportViolations.slice(0, 10));
console.log(`Total deep import violations found: ${deepImportViolations.length}`);

// 3. Service lines check (CQRS Rule: > 250 lines or > 5 operations)
const cqrsViolations = [];
serviceFiles.forEach(f => {
  const content = fs.readFileSync(f, "utf8");
  const rel = path.relative(root, f).replace(/\\/g, "/");
  const lines = content.split("\n");
  
  // Count operations (rough estimate: counting functions inside class or exported functions/methods)
  const operationMatches = content.match(/(async\s+\w+|public\s+async\s+\w+|\basync\s+function\s+\w+)/g) || [];
  
  if (lines.length > 250 || operationMatches.length > 5) {
    cqrsViolations.push(`${rel} (${lines.length} lines, ~${operationMatches.length} operations)`);
  }
});

console.log("\n=== CQRS Violations (Service >250 lines or >5 operations) ===");
console.log(cqrsViolations);
