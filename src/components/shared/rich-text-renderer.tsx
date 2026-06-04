"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-neutral dark:prose-neutral ${className}`}>
      {isMarkdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}
