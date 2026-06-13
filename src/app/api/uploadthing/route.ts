import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

// Patch global fetch to prevent undici / Node fetch from crashing on manual content-length headers
if (typeof globalThis.fetch === "function") {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = function (input: any, init: any) {
    if (init && init.headers) {
      if (init.headers instanceof Headers) {
        if (init.headers.has("content-length")) {
          const newHeaders = new Headers(init.headers);
          newHeaders.delete("content-length");
          init.headers = newHeaders;
        }
      } else if (Array.isArray(init.headers)) {
        init.headers = init.headers.filter(
          (item: any) => {
            const key = Array.isArray(item) ? item[0] : typeof item === "object" && item ? Object.keys(item)[0] : "";
            return typeof key === "string" && key.toLowerCase() !== "content-length";
          }
        );
      } else if (typeof init.headers === "object") {
        const newHeaders: Record<string, any> = {};
        for (const [key, val] of Object.entries(init.headers)) {
          if (key.toLowerCase() !== "content-length") {
            newHeaders[key] = val;
          }
        }
        init.headers = newHeaders;
      }
    }
    return originalFetch.call(this, input, init);
  };
}

import { ensureUploadThingToken } from "@/shared/lib/uploadthing-token";
import { auth } from "@/auth";
import { isTeacherOrAdmin } from "@/features/auth/server";

// Note: do not validate UPLOADTHING_TOKEN at module init to avoid build-time
// failures. Validation is performed at runtime when handling uploads.
const f = createUploadthing();

const checkAuth = async () => {
  const session = await auth();
  if (!session?.user || !isTeacherOrAdmin(session.user.role as any)) {
    throw new Error("Unauthorized");
  }
  return { userId: session.user.id };
};

const checkAnyAuth = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return { userId: session.user.id };
};

export const ourFileRouter = {
  courseThumbnail: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      ensureUploadThingToken();
      return await checkAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  courseVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => {
      ensureUploadThingToken();
      return await checkAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  lessonVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => {
      ensureUploadThingToken();
      return await checkAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  lessonAttachment: f({
    blob: { maxFileSize: "32MB", maxFileCount: 5 },
    pdf: { maxFileSize: "32MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      ensureUploadThingToken();
      return await checkAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      ensureUploadThingToken();
      return await checkAnyAuth();
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
