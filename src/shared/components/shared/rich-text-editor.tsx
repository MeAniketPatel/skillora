"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  label: string;
  shortcut?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  shortcut,
  isActive,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={isActive}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            "h-7 w-7 text-neutral-600 dark:text-neutral-400",
            isActive &&
              "bg-neutral-200 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800",
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-1.5 text-xs">
        <span>{label}</span>
        {shortcut && (
          <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
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

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-950/50">
        <div className="h-[45px] border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50" />
        <div className="min-h-[150px] p-3" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-md border border-neutral-200 bg-white/50 transition-colors focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950/50 dark:focus-within:border-neutral-600 dark:focus-within:ring-neutral-800">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50/80 p-1 dark:border-neutral-800 dark:bg-neutral-900/50">
          <ToolbarButton
            label="Bold"
            shortcut="⌘B"
            isActive={editor.isActive("bold")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            shortcut="⌘I"
            isActive={editor.isActive("italic")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            shortcut="⌘⇧X"
            isActive={editor.isActive("strike")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Inline code"
            shortcut="⌘E"
            isActive={editor.isActive("code")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-0.5 h-5" />

          <ToolbarButton
            label="Heading 2"
            shortcut="⌘⌥2"
            isActive={editor.isActive("heading", { level: 2 })}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            shortcut="⌘⇧8"
            isActive={editor.isActive("bulletList")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            shortcut="⌘⇧7"
            isActive={editor.isActive("orderedList")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Quote"
            isActive={editor.isActive("blockquote")}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-0.5 h-5" />

          <ToolbarButton
            label="Undo"
            shortcut="⌘Z"
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            shortcut="⌘⇧Z"
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        <EditorContent
          editor={editor}
          className="min-h-[150px] p-3 text-sm focus:outline-none [&_p]:my-2 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-neutral-600 dark:[&_blockquote]:border-neutral-700 dark:[&_blockquote]:text-neutral-400 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs dark:[&_code]:bg-neutral-800"
        />
      </div>
    </TooltipProvider>
  );
}
