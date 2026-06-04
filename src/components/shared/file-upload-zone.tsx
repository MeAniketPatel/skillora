"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadZoneProps {
  endpoint: "courseThumbnail" | "courseVideo" | "lessonVideo" | "lessonAttachment"; // backend uploadthing endpoints
  onClientUploadComplete: (res: any) => void;
  onUploadError?: (error: Error) => void;
}

export function FileUploadZone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
}: FileUploadZoneProps) {
  return (
    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50/50 dark:bg-neutral-900/20 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-all duration-300">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          toast.success("File uploaded successfully");
          onClientUploadComplete(res);
        }}
        onUploadError={(error) => {
          toast.error(`Upload error: ${error.message}`);
          if (onUploadError) onUploadError(error);
        }}
        className="ut-label:text-primary ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:text-white ut-button:rounded-xl ut-button:font-medium ut-label:font-semibold ut-allowed-content:text-neutral-400 dark:ut-allowed-content:text-neutral-500"
      />
    </div>
  );
}
