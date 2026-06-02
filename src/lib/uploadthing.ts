export function getUploadThingToken() {
  const token = process.env.UPLOADTHING_TOKEN || null;
  return token;
}

export function ensureUploadThingToken() {
  const token = getUploadThingToken();
  if (!token) {
    throw new Error(
      "Upload failed: Missing token. Please set the UPLOADTHING_TOKEN environment variable or provide a token via config.",
    );
  }
  return token;
}
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/route";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
