#!/usr/bin/env node
/**
 * Generate a service module for every feature in src/features/.
 *
 * For each feature that has at least one repository function exported, the
 * script:
 *   1. Reads the repository exports.
 *   2. Generates `services/<feature>.service.ts` with a service object
 *      that wraps the repository (default-param DI per ADR-007).
 *   3. Adds the service to the feature barrel.
 *
 * The service delegates to the repository by default; mutations are wrapped
 * with `bus.emit` to fire domain events.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

function listFiles(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, exts, results);
    else if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

function listRepoFunctions(repoFiles) {
  const out = [];
  for (const f of repoFiles) {
    const text = fs.readFileSync(f, "utf8");
    const re = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g;
    let m;
    while ((m = re.exec(text)) !== null) out.push(m[1]);
  }
  return out;
}

const MUTATION_PREFIXES = [
  "create",
  "update",
  "delete",
  "remove",
  "add",
  "remove",
  "set",
  "toggle",
  "increment",
  "decrement",
  "upsert",
  "mark",
  "unmark",
  "record",
  "save",
  "ban",
  "unban",
  "approve",
  "reject",
  "publish",
  "unpublish",
  "archive",
  "restore",
  "enable",
  "disable",
  "lock",
  "unlock",
  "start",
  "stop",
  "end",
  "complete",
  "submit",
  "redeem",
  "convert",
  "enroll",
  "unenroll",
  "follow",
  "unfollow",
  "log",
  "track",
  "increment",
  "decrement",
  "accept",
  "resolve",
  "buy",
];

function isMutation(name) {
  const lower = name.toLowerCase();
  return MUTATION_PREFIXES.some((p) => lower.startsWith(p));
}

const features = fs
  .readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let created = 0;
for (const feature of features) {
  const repoDir = path.join(featuresDir, feature, "repositories");
  if (!fs.existsSync(repoDir)) continue;
  const repoFiles = listFiles(repoDir, [".ts"], []).filter((f) => f.endsWith(".repository.ts"));
  const fns = listRepoFunctions(repoFiles);
  if (fns.length === 0) continue;

  const repoImports = repoFiles
    .map((f) => {
      const rel = path
        .relative(path.join(featuresDir, feature, "services"), f)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");
      return `import * as ${aliasFor(f)} from "${rel.startsWith(".") ? rel : "./" + rel}";`;
    })
    .join("\n");

  const serviceMethods = fns
    .map((fn) => {
      const fnRepo = aliasFor(repoFiles.find((f) => fnsBelongTo(f, fn)) || repoFiles[0]);
      const params = `...args: Parameters<typeof ${fnRepo}.${fn}>`;
      if (isMutation(fn)) {
        const eventName = `${feature}.${fn.replace(/^./, (c) => c.toLowerCase())}`;
        return `  async ${fn}(${params}): Promise<Awaited<ReturnType<typeof ${fnRepo}.${fn}>>> {
    const result = await ${fnRepo}.${fn}(...args);
    await eventBus.emit({ name: "${eventName}", feature: "${feature}", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },`;
      }
      return `  ${fn}: ${fnRepo}.${fn},`;
    })
    .join("\n");

  const serviceBody = `// Auto-generated service wrapper for the ${feature} feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
${repoImports}

export const ${toCamel(feature)}Service = {
${serviceMethods}
};

export type ${toPascal(feature)}Service = typeof ${toCamel(feature)}Service;
`;

  const servicesDir = path.join(featuresDir, feature, "services");
  fs.mkdirSync(servicesDir, { recursive: true });
  const out = path.join(servicesDir, `${feature}.service.ts`);
  fs.writeFileSync(out, serviceBody, "utf8");

  const barrel = path.join(featuresDir, feature, "index.ts");
  let barrelText = fs.readFileSync(barrel, "utf8");
  barrelText = barrelText.replace(
    /\/\/ Services\n[\s\S]*?(?=\n\/\/|\n*$)/g,
    ""
  ).replace(/\n+$/, "\n");
  barrelText += `\n// Services\nexport { ${toCamel(feature)}Service } from "./services/${feature}.service";\nexport type { ${toPascal(feature)}Service } from "./services/${feature}.service";\n`;
  fs.writeFileSync(barrel, barrelText, "utf8");
  created += 1;
}

function toCamel(s) {
  return s.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
}

function toPascal(s) {
  return s
    .split(/[-_]/)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

function aliasFor(file) {
  const base = path.basename(file, ".repository.ts");
  return base.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase()) + "Repo";
}

function fnsBelongTo(file, fn) {
  const text = fs.readFileSync(file, "utf8");
  return new RegExp(`export\\s+(?:async\\s+)?function\\s+${fn}\\b`).test(text);
}

console.log(`Services created for ${created} features.`);
