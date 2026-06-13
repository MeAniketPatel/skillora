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
  const [progress, setProgress] = useState(0);

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
      className={`relative border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden ${
        isDragging
          ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20"
          : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20"
      } aria-invalid:border-red-500`}
    >
      {isUploading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[200px] gap-3 backdrop-blur-sm bg-white/90 dark:bg-neutral-950/90">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-600 border-t-transparent" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Uploading {label}... ({progress}% complete)
            </span>
            <span className="text-xs text-neutral-500">Please don't close this tab</span>
          </div>
        </div>
      )}
      {isDragging && !isUploading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[200px] gap-2 bg-indigo-50/50 dark:bg-indigo-950/40 pointer-events-none">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center">
            <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Drop to upload {label}
          </span>
        </div>
      )}
      <UploadDropzone
        endpoint={endpoint}
        config={{ mode: "auto" }}
        onUploadProgress={(p) => setProgress(p)}
        onUploadBegin={() => {
          setIsUploading(true);
          setProgress(0);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          setProgress(0);
          const fileUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
          if (fileUrl) onComplete(fileUrl);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          setProgress(0);
          onError(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
