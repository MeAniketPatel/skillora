import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

export const CACHE_TAGS = {
  COURSE: "course",
  COURSE_LIST: "course:list",
  USER: "user",
  ANALYTICS: "analytics",
  PLATFORM_STATS: "platform:stats",
  INSTRUCTOR: "instructor",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const cache = {
  cached<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    options: { keyParts: string[]; revalidateSec?: number; tags?: CacheTag[] },
  ) {
    return unstable_cache(fn, options.keyParts, {
      revalidate: options.revalidateSec ?? 60,
      tags: options.tags,
    });
  },
  invalidateTag(tag: CacheTag) {
    revalidateTag(tag, "default");
  },
  invalidatePath(path: string, type?: "layout" | "page") {
    revalidatePath(path, type);
  },
};
