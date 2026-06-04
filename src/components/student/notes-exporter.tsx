"use client";

import React from "react";
import { FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateNotesPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface NoteItem {
  title: string;
  content: string;
  timestamp?: number | null;
}

interface NotesExporterProps {
  notes: NoteItem[];
  fileName?: string;
}

export function NotesExporter({ notes, fileName = "my-notes" }: NotesExporterProps) {
  const handleExportMarkdown = () => {
    if (notes.length === 0) {
      toast.error("No notes to export");
      return;
    }

    try {
      const mdContent = notes
        .map((note) => {
          const cleanContent = note.content.replace(/<[^>]*>/g, ""); // Strip HTML tags
          const timestampStr = note.timestamp
            ? ` [Timestamp: ${Math.floor(note.timestamp / 60)}:${String(note.timestamp % 60).padStart(2, "0")}]`
            : "";
          return `# ${note.title}${timestampStr}\n\n${cleanContent}\n\n---\n`;
        })
        .join("\n");

      const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Notes exported as Markdown!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Markdown");
    }
  };

  const handleExportPDF = () => {
    if (notes.length === 0) {
      toast.error("No notes to export");
      return;
    }

    try {
      const formattedNotes = notes.map((n) => ({
        title: n.title,
        content: n.content,
      }));
      const doc = generateNotesPDF(formattedNotes);
      doc.save(`${fileName}.pdf`);
      toast.success("Notes exported as PDF!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportMarkdown}
        disabled={notes.length === 0}
        className="rounded-xl flex items-center gap-1.5"
      >
        <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span>Export MD</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={notes.length === 0}
        className="rounded-xl flex items-center gap-1.5"
      >
        <FileDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        <span>Export PDF</span>
      </Button>
    </div>
  );
}
