#!/usr/bin/env node
/**
 * Create stub services for features that have no repositories.
 * The stub exposes an empty object so hooks and barrels compile.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

const STUB_FEATURES = [
  "cart",
  "chat",
  "code-playground",
  "learn",
  "marketing",
  "study-groups",
];

function toCamel(s) {
  return s.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
}
function toPascal(s) {
  return s.split(/[-_]/).map((p) => p[0].toUpperCase() + p.slice(1)).join("");
}

for (const feature of STUB_FEATURES) {
  const servicesDir = path.join(featuresDir, feature, "services");
  fs.mkdirSync(servicesDir, { recursive: true });
  const out = path.join(servicesDir, `${feature}.service.ts`);
  if (fs.existsSync(out)) continue;
  const body = `// Stub service for the ${feature} feature. This feature has no
// data-access layer of its own; it composes state from other features.
import { eventBus } from "@/shared/events";

export const ${toCamel(feature)}Service = {} as const;

export type ${toPascal(feature)}Service = typeof ${toCamel(feature)}Service;
`;
  fs.writeFileSync(out, body, "utf8");
  const barrel = path.join(featuresDir, feature, "index.ts");
  let barrelText = fs.readFileSync(barrel, "utf8");
  if (!barrelText.includes("// Services")) {
    barrelText += `\n// Services\nexport { ${toCamel(feature)}Service } from "./services/${feature}.service";\nexport type { ${toPascal(feature)}Service } from "./services/${feature}.service";\n`;
  }
  fs.writeFileSync(barrel, barrelText, "utf8");
  console.log(`Created stub service for ${feature}.`);
}
