"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({ value, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden bg-white/50 dark:bg-neutral-950/50">
      {/* Basic Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs rounded font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor?.isActive("bold") ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
        >
          B
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs rounded italic hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor?.isActive("italic") ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
        >
          I
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-xs rounded line-through hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor?.isActive("strike") ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
        >
          S
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-xs rounded font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor?.isActive("heading", { level: 2 }) ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor?.isActive("bulletList") ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
        >
          List
        </button>
      </div>

      <EditorContent editor={editor} className="p-3 min-h-[150px] focus:outline-none" />
    </div>
  );
}
