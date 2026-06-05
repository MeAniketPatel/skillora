#!/usr/bin/env node
/**
 * Generate real, hand-tuned React hooks for the most-used features and
 * re-export them from each feature's client barrel. Each hook wraps the
 * feature's server action(s) in loading/error/data state so client
 * components don't have to repeat the useTransition boilerplate.
 *
 * Hooks use the actual action signatures (parsed from src/actions/*)
 * and return ActionResult-aware state objects.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const featuresDir = path.join(root, "src", "features");
const actionsDir = path.join(root, "src", "actions");

// Parse exported action names + their first parameter type from
// `src/actions/*.ts` so we generate call-sites that match the real
// signatures. We treat all `values: any` / `values: z.infer<...>` /
// `values: { ... }` as object params; everything else is inferred.
const actionExports = {};
for (const f of fs.readdirSync(actionsDir).filter(n => n.endsWith(".actions.ts"))) {
  const text = fs.readFileSync(path.join(actionsDir, f), "utf8");
  const re = /export\s+async\s+function\s+(\w+)\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    actionExports[m[1]] = { params: m[2], file: f };
  }
}

const HOOKS = {
  "feature-flags": `"use client";

import { useState, useTransition, useCallback } from "react";
import { z } from "zod";
import {
  createFeatureFlagAction,
  toggleFeatureFlagAction,
  updateFeatureFlagRolloutAction,
  deleteFeatureFlagAction,
} from "@/actions/feature-flag.actions";
import {
  featureFlagSchema,
  toggleFeatureFlagSchema,
  updateRolloutSchema,
} from "@/features/feature-flags/contracts/feature-flag.contract";

export function useFeatureFlag() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (input: z.infer<typeof featureFlagSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createFeatureFlagAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const toggle = useCallback(async (input: z.infer<typeof toggleFeatureFlagSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await toggleFeatureFlagAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const updateRollout = useCallback(async (input: z.infer<typeof updateRolloutSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateFeatureFlagRolloutAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteFeatureFlagAction(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, toggle, updateRollout, remove };
}
`,
  admin: `"use client";

import { useState, useTransition, useCallback } from "react";
import {
  approveCourse,
  rejectCourse,
  banUser,
  unbanUser,
  updateUserRole,
} from "@/actions/admin.actions";
import { impersonateUserAction, stopImpersonationAction } from "@/actions/impersonation.actions";
import { approveModerationItemAction, rejectModerationItemAction, flagContentAction } from "@/actions/moderation.actions";

export function useAdminActions() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const approve = useCallback(async (courseId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await approveCourse(courseId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const reject = useCallback(async (courseId: string, reason: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await rejectCourse(courseId, reason);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const ban = useCallback(async (userId: string, reason?: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await banUser(userId, reason);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const unban = useCallback(async (userId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await unbanUser(userId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const setRole = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateUserRole(values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const impersonate = useCallback(async (targetUserId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await impersonateUserAction(targetUserId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const stopImpersonating = useCallback(async () => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await stopImpersonationAction();
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const approveModeration = useCallback(async (id: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await approveModerationItemAction(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const rejectModeration = useCallback(async (id: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await rejectModerationItemAction(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const flag = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await flagContentAction(values as Parameters<typeof flagContentAction>[0]);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return {
    isPending, error,
    approve, reject, ban, unban, setRole,
    impersonate, stopImpersonating,
    approveModeration, rejectModeration, flag,
  };
}
`,
  announcements: `"use client";

import { useState, useTransition, useCallback } from "react";
import { z } from "zod";
import { createGlobalAnnouncement, deleteGlobalAnnouncement } from "@/actions/announcement.actions";
import { announcementSchema } from "@/features/announcements/contracts/announcement.contract";

export function useAnnouncements() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (input: z.infer<typeof announcementSchema>) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createGlobalAnnouncement(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (announcementId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteGlobalAnnouncement(announcementId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, remove };
}
`,
  notifications: `"use client";

import { useState, useTransition, useCallback } from "react";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notification.actions";

export function useNotifications() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const markRead = useCallback(async (id: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await markNotificationAsRead(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const markAllRead = useCallback(async () => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await markAllNotificationsAsRead();
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, markRead, markAllRead };
}
`,
  reviews: `"use client";

import { useState, useTransition, useCallback } from "react";
import { createReview, updateReview, deleteReview } from "@/actions/review.actions";

export function useReviews() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createReview(values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const update = useCallback(async (reviewId: string, values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateReview(reviewId, values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (reviewId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteReview(reviewId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, update, remove };
}
`,
  settings: `"use client";

import { useState, useTransition, useCallback } from "react";
import { updateSetting } from "@/actions/settings.actions";

export function useSettings() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const update = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateSetting(values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, update };
}
`,
};

let created = 0;
for (const [feature, body] of Object.entries(HOOKS)) {
  const hooksDir = path.join(featuresDir, feature, "hooks");
  fs.mkdirSync(hooksDir, { recursive: true });
  const fp = path.join(hooksDir, `use-${feature}.ts`);
  fs.writeFileSync(fp, body, "utf8");
  created += 1;
}

// Add Hooks section to client barrels (idempotent)
let barrelsUpdated = 0;
for (const [feature] of Object.entries(HOOKS)) {
  const barrel = path.join(featuresDir, feature, "index.ts");
  if (!fs.existsSync(barrel)) continue;
  let text = fs.readFileSync(barrel, "utf8");
  const sectionRe = /\/\/ Hooks\r?\n[\s\S]*?(?=\r?\n\/\/ [A-Z]|\s*$)/;
  let prev;
  do { prev = text; text = text.replace(sectionRe, ""); } while (text !== prev);
  const hookName = "use" + feature.split("-").map(p => p[0].toUpperCase() + p.slice(1)).join("");
  const funcName = feature === "feature-flags" ? "useFeatureFlag" : feature === "admin" ? "useAdminActions" : hookName;
  text += `\n// Hooks\nexport { ${funcName} } from "./hooks/use-${feature}";\n`;
  fs.writeFileSync(barrel, text, "utf8");
  barrelsUpdated += 1;
}

console.log(`Created ${created} hooks; updated ${barrelsUpdated} client barrels.`);
console.log(`Discovered ${Object.keys(actionExports).length} action exports in src/actions/.`);
