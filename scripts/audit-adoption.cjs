#!/usr/bin/env node
/**
 * Measure how much of the new architecture is actually being used by
 * application code (not just generated). Reports a numeric score.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const srcDir = path.join(root, "src");

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

const files = walk(srcDir, [".ts", ".tsx"], []);
const isApp = (f) => f.includes(`${path.sep}actions${path.sep}`) || f.includes(`${path.sep}app${path.sep}`) || f.includes(`${path.sep}lib${path.sep}`);
const appFiles = files.filter(isApp);
const featureFiles = files.filter((f) => f.includes(`${path.sep}features${path.sep}`));

const counts = {
  services: 0,
  permissions: 0,
  hooks: 0,
  contracts: 0,
  legacy_validations: 0,
  legacy_actions: 0,
  legacy_data: 0,
  legacy_components: 0,
  legacy_hooks: 0,
  legacy_stores: 0,
};

const re = {
  legacyValidations: /from\s*["']@\/validations\//g,
  legacyActions: /from\s*["']@\/actions\//g,
  legacyData: /from\s*["']@\/data\//g,
  legacyComponents: /from\s*["']@\/components\//g,
  legacyHooks: /from\s*["']@\/hooks\//g,
  legacyStores: /from\s*["']@\/stores\//g,
  useService: /from\s*["']@\/features\/[^"']+\/services\//g,
  usePermission: /from\s*["']@\/features\/[^"']+\/permissions\//g,
  useHook: /from\s*["']@\/features\/[^"']+\/hooks\//g,
  useContract: /from\s*["']@\/features\/[^"']+\/contracts\//g,
};

for (const f of appFiles) {
  const text = fs.readFileSync(f, "utf8");
  counts.legacy_validations += (text.match(re.legacyValidations) || []).length;
  counts.legacy_actions += (text.match(re.legacyActions) || []).length;
  counts.legacy_data += (text.match(re.legacyData) || []).length;
  counts.legacy_components += (text.match(re.legacyComponents) || []).length;
  counts.legacy_hooks += (text.match(re.legacyHooks) || []).length;
  counts.legacy_stores += (text.match(re.legacyStores) || []).length;
  counts.services += (text.match(re.useService) || []).length;
  counts.permissions += (text.match(re.usePermission) || []).length;
  counts.hooks += (text.match(re.useHook) || []).length;
  counts.contracts += (text.match(re.useContract) || []).length;
}

const featureContracts = featureFiles.filter((f) => /contracts[\\/][^\\/]+contract\.ts$/.test(f));
const stubContracts = featureContracts.filter((f) => /TODO: define input shape/.test(fs.readFileSync(f, "utf8"))).length;

console.log("---- Application adoption (src/actions, src/app, src/lib) ----");
console.log("New layer uses:");
console.log(`  service imports:      ${counts.services}`);
console.log(`  permission imports:  ${counts.permissions}`);
console.log(`  hook imports:        ${counts.hooks}`);
console.log(`  contract imports:    ${counts.contracts}`);
console.log("Legacy layer uses (target = 0):");
console.log(`  @/validations:       ${counts.legacy_validations}`);
console.log(`  @/actions:           ${counts.legacy_actions}`);
console.log(`  @/data:              ${counts.legacy_data}`);
console.log(`  @/components:        ${counts.legacy_components}`);
console.log(`  @/hooks:             ${counts.legacy_hooks}`);
console.log(`  @/stores:            ${counts.legacy_stores}`);
console.log("Contracts:");
console.log(`  total:  ${featureContracts.length}`);
console.log(`  stubs:  ${stubContracts}`);
const adoptRatio = (counts.services + counts.permissions + counts.hooks + counts.contracts) /
  Math.max(1, counts.services + counts.permissions + counts.hooks + counts.contracts +
    counts.legacy_validations + counts.legacy_actions + counts.legacy_components);
const stubRatio = stubContracts / Math.max(1, featureContracts.length);
const score = Math.round(adoptRatio * 10 * (1 - stubRatio * 0.5) * 10) / 10;
console.log(`\nArchitecture adoption score: ${score}/10`);
