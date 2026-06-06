"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeRichHtml } from "@/shared/lib/sanitize";

interface RichTextRendererProps {
  content: string;
  isMarkdown?: boolean;
  className?: string;
}

export function RichTextRenderer({
  content,
  isMarkdown = false,
  className = "",
}: RichTextRendererProps) {
  const sanitized = useMemo(() => (isMarkdown ? "" : sanitizeRichHtml(content)), [content, isMarkdown]);

  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-neutral dark:prose-neutral ${className}`}>
      {isMarkdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: sanitized }} />
      )}
    </div>
  );
}
