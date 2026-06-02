import { createRouteHandler, createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

const checkAuth = async () => {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }
  return { userId: session.user.id };
};

export const ourFileRouter = {
  courseThumbnail: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await checkAuth())
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  courseVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => await checkAuth())
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  lessonVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => await checkAuth())
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  lessonAttachment: f({ 
    blob: { maxFileSize: "32MB", maxFileCount: 5 },
    pdf: { maxFileSize: "32MB", maxFileCount: 5 }
  })
    .middleware(async () => await checkAuth())
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

