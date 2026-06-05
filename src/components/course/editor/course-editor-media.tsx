"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { UploadDropzone } from "@/shared/lib/uploadthing";
import type { CourseEditorForm } from "./course-editor.shared";

interface CourseEditorMediaProps {
  form: CourseEditorForm;
  isPending: boolean;
  onUploadComplete: (values: Record<string, unknown>) => void;
  onError: (message: string) => void;
}

export function CourseEditorMediaSection({
  form,
  isPending,
  onUploadComplete,
  onError,
}: CourseEditorMediaProps) {
  const { setValue, watch, formState: { errors } } = form;
  const thumbnailVal = watch("thumbnail");
  const promoVideoVal = watch("promoVideo");

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Course Thumbnail</CardTitle>
          <CardDescription>Upload a course cover image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {thumbnailVal ? (
            <ThumbnailPreview
              src={thumbnailVal}
              onRemove={() => setValue("thumbnail", "")}
              disabled={isPending}
            />
          ) : (
            <Dropzone
              endpoint="courseThumbnail"
              isDragging={isDraggingThumbnail}
              setIsDragging={setIsDraggingThumbnail}
              isUploading={isUploadingThumbnail}
              setIsUploading={setIsUploadingThumbnail}
              onComplete={(fileUrl) => {
                setValue("thumbnail", fileUrl);
                onUploadComplete({ thumbnail: fileUrl });
              }}
              onError={onError}
              label="cover image"
              hasError={!!errors.thumbnail}
              fieldId="thumbnail"
            />
          )}
          {errors.thumbnail && (
            <p className="text-sm text-red-500 font-medium">
              {errors.thumbnail.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Course Promo Video</CardTitle>
          <CardDescription>
            Upload a short video to introduce your course.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {promoVideoVal ? (
            <PromoVideoPreview
              src={promoVideoVal}
              onRemove={() => {
                setValue("promoVideo", "");
                onUploadComplete({ promoVideo: "" });
              }}
              disabled={isPending}
            />
          ) : (
            <Dropzone
              endpoint="courseVideo"
              isDragging={isDraggingVideo}
              setIsDragging={setIsDraggingVideo}
              isUploading={isUploadingVideo}
              setIsUploading={setIsUploadingVideo}
              onComplete={(fileUrl) => {
                setValue("promoVideo", fileUrl);
                onUploadComplete({ promoVideo: fileUrl });
              }}
              onError={onError}
              label="promo video"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ThumbnailPreview({
  src,
  onRemove,
  disabled,
}: {
  src: string;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Thumbnail" className="w-full h-full object-cover" />
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
        disabled={disabled}
      >
        Remove Image
      </Button>
    </div>
  );
}

function PromoVideoPreview({
  src,
  onRemove,
  disabled,
}: {
  src: string;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
        <video src={src} controls className="w-full h-full object-contain" />
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onRemove}
        disabled={disabled}
      >
        Remove Video
      </Button>
    </div>
  );
}

interface DropzoneProps {
  endpoint: "courseThumbnail" | "courseVideo";
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
  onComplete: (fileUrl: string) => void;
  onError: (message: string) => void;
  label: string;
  hasError?: boolean;
  fieldId?: string;
}

function Dropzone({
  endpoint,
  isDragging,
  setIsDragging,
  isUploading,
  setIsUploading,
  onComplete,
  onError,
  label,
  hasError,
  fieldId,
}: DropzoneProps) {
  return (
    <div
      id={fieldId}
      aria-invalid={hasError}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-all duration-200 overflow-hidden ${
        isDragging
          ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 scale-[1.02]"
          : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20"
      } aria-invalid:border-destructive`}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-950/20 z-20 flex flex-col items-center justify-center pointer-events-none border-2 border-indigo-500 rounded-lg animate-pulse">
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Drop to upload {label}!
          </span>
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 z-10 flex flex-col items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Uploading {label}...
          </span>
        </div>
      )}
      <UploadDropzone
        endpoint={endpoint}
        config={{ mode: "auto" }}
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          const fileUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
          if (fileUrl) onComplete(fileUrl);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          onError(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
