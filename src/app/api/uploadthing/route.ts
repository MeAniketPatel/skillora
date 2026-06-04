import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";
import { ensureUploadThingToken } from "@/lib/uploadthing";
import { auth } from "@/auth";

// Note: do not validate UPLOADTHING_TOKEN at module init to avoid build-time
// failures. Validation is performed at runtime when handling uploads.
const f = createUploadthing();

const checkAuth = async () => {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
