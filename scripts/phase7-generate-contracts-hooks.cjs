#!/usr/bin/env node
/**
 * Generate contracts (Zod schemas) and hooks (React Query) for every feature.
 *
 * Contracts: a default empty z.object() placeholder per CRUD action.
 * Hooks: a `use<Feature>Query(key, fn)` factory plus `use<Feature>Mutation(...)`.
 *
 * The codemod is a starter template; features override the generated file
 * with hand-written schemas.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");

const features = fs
  .readdirSync(featuresDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let contracts = 0;
let hooks = 0;
for (const feature of features) {
  // --- contracts ---
  const contractsDir = path.join(featuresDir, feature, "contracts");
  fs.mkdirSync(contractsDir, { recursive: true });
  const contractFile = path.join(contractsDir, `${feature}.contract.ts`);
  if (!fs.existsSync(contractFile)) {
    const body = `import { z } from "zod";

export const create${toPascal(feature)}Schema = z.object({
  // TODO: define input shape
});

export const update${toPascal(feature)}Schema = z.object({
  id: z.string(),
});

export const list${toPascal(feature)}QuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type Create${toPascal(feature)}Input = z.infer<typeof create${toPascal(feature)}Schema>;
export type Update${toPascal(feature)}Input = z.infer<typeof update${toPascal(feature)}Schema>;
export type List${toPascal(feature)}Query = z.infer<typeof list${toPascal(feature)}QuerySchema>;
`;
    fs.writeFileSync(contractFile, body, "utf8");
    contracts += 1;
  }
  // --- hooks ---
  const hooksDir = path.join(featuresDir, feature, "hooks");
  fs.mkdirSync(hooksDir, { recursive: true });
  const hookFile = path.join(hooksDir, `use-${feature}.ts`);
  if (!fs.existsSync(hookFile)) {
    const camel = toCamel(feature);
    const pascal = toPascal(feature);
    const body = `"use client";

import { useState, useEffect, useCallback } from "react";
import { ${camel}Service } from "../services/${feature}.service";

export function use${pascal}List(params?: unknown) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((${camel}Service as any).list?.(params))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);
  return { data, error, isLoading };
}

export function use${pascal}Detail(id: string | null | undefined) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((${camel}Service as any).getById?.(id))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);
  return { data, error, isLoading };
}

export function use${pascal}Create() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (${camel}Service as any).create?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function use${pascal}Update() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (${camel}Service as any).update?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function use${pascal}Delete() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (id: string) => {
    setIsPending(true);
    try {
      return await (${camel}Service as any).delete?.(id);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}
`;
    fs.writeFileSync(hookFile, body, "utf8");
    hooks += 1;
  }
  // --- barrel ---
  const barrel = path.join(featuresDir, feature, "index.ts");
  let barrelText = fs.readFileSync(barrel, "utf8");
  if (!barrelText.includes("// Contracts")) {
    barrelText += `\n// Contracts\nexport { create${toPascal(feature)}Schema, update${toPascal(feature)}Schema, list${toPascal(feature)}QuerySchema } from "./contracts/${feature}.contract";\nexport type { Create${toPascal(feature)}Input, Update${toPascal(feature)}Input, List${toPascal(feature)}Query } from "./contracts/${feature}.contract";\n`;
  }
  if (!barrelText.includes("// Hooks")) {
    const pascal = toPascal(feature);
    barrelText += `\n// Hooks\nexport { use${pascal}List, use${pascal}Detail, use${pascal}Create, use${pascal}Update, use${pascal}Delete } from "./hooks/use-${feature}";\n`;
  }
  fs.writeFileSync(barrel, barrelText, "utf8");
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

console.log(`Contracts created: ${contracts}, hooks created: ${hooks}.`);
