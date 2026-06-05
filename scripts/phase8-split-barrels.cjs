#!/usr/bin/env node
/**
 * Split each feature barrel into:
 *   - index.ts (client-safe: components, hooks, contracts, permissions, types)
 *   - server.ts (server-only: services, repositories)
 *
 * Rules:
 *   - `export * from "./repositories/..."` goes to server.ts
 *   - `export { ... } from "./repositories/..."` (named) goes to server.ts
 *   - `export type { ... } from "./repositories/..."` goes to BOTH (types are safe)
 *   - `export { default as X } from "./repositories/..."` goes to server.ts
 *   - Everything else stays in index.ts
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

const SECTION_HEADERS = [
  "// Components",
  "// Hooks",
  "// Contracts",
  "// Permissions",
  "// Services",
];

const features = fs
  .readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let updated = 0;
for (const feature of features) {
  const barrel = path.join(featuresDir, feature, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  const text = fs.readFileSync(barrel, "utf8");
  const lines = text.split("\n");

  const clientLines = [];
  const serverLines = [];
  let currentSection = "header";

  for (const line of lines) {
    if (SECTION_HEADERS.includes(line.trim())) {
      if (line.trim() === "// Services") {
        currentSection = "server";
        serverLines.push("");
        serverLines.push(line);
      } else {
        currentSection = "client";
        clientLines.push("");
        clientLines.push(line);
      }
      continue;
    }
    const isRepoExport =
      /from\s*["'][^"']*\/repositories\//.test(line) &&
      /export/.test(line);
    if (isRepoExport) {
      // type-only re-exports stay in both
      if (/^export\s+type\s*\{/.test(line.trim())) {
        clientLines.push(line);
        serverLines.push(line);
      } else {
        serverLines.push(line);
      }
    } else if (currentSection === "server") {
      serverLines.push(line);
    } else {
      clientLines.push(line);
    }
  }

  const clientText = clientLines.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\n+$/, "\n");
  const serverText = serverLines.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\n+$/, "\n");

  fs.writeFileSync(barrel, clientText, "utf8");
  const serverBarrel = path.join(featuresDir, feature, "server.ts");
  const serverHeader = `// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.
`;
  fs.writeFileSync(serverBarrel, serverHeader + serverText, "utf8");
  updated += 1;
}
console.log(`Updated ${updated} feature barrels.`);
