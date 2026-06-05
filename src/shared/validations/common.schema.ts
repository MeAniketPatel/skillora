import { z } from "zod";

export const cuidSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[a-z0-9]+$/i, "Invalid identifier format");

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const urlSchema = z
  .string()
  .trim()
  .url("Invalid URL");

export const nonEmptyString = (max = 500) =>
  z
    .string()
    .trim()
    .min(1, "Value is required")
    .max(max, `Value must be ${max} characters or fewer`);

export const optionalString = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

export const idParamSchema = z.object({ id: cuidSchema });

export type IdParam = z.infer<typeof idParamSchema>;
