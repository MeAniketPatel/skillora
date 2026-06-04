"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ClipboardList, Send, Sparkles } from "lucide-react";
import { submitAssignment } from "@/actions/assignment.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssignmentViewProps {
  lessonId: string;
  initialSubmission: any;
}

export default function AssignmentView({ lessonId, initialSubmission }: AssignmentViewProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialSubmission?.content || "");
  const [isPending, startTransition] = useTransition();
  const [submission, setSubmission] = useState(initialSubmission);

  const handleSubmit = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await submitAssignment(lessonId, content);
      if (res.success) {
        setSubmission(res.data);
        router.refresh();
      }
    });
  };

  const isGraded = submission?.status === "GRADED";
  const isSubmitted = submission?.status === "SUBMITTED" || isGraded;

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-100 dark:border-neutral-800/50 pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-lg font-bold">Assignment Workspace</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Submit your work as a text response or share a URL to your project (GitHub, Figma, etc.).
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {isGraded && (
          <div className="p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-800/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Graded & Completed
              </span>
              <span className="text-2xl font-black text-green-600 dark:text-green-400">
                {submission.score} <span className="text-xs font-semibold text-neutral-400">/ 100</span>
              </span>
            </div>
            {submission.feedback && (
              <div className="pt-2 border-t border-green-100 dark:border-green-900/40 mt-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Instructor Feedback:</span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 italic">
                  "{submission.feedback}"
                </p>
              </div>
            )}
          </div>
        )}

        {isSubmitted && !isGraded && (
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-200/50 dark:border-indigo-800/40 rounded-xl">
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider block">
              Waiting for Instructor Review
            </span>
            <p className="text-xs text-neutral-500 mt-1">
              Your submission is locked and pending evaluation. Your lesson progress is marked complete.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Your Work Submission
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitted}
            rows={6}
            placeholder="Type your response here or paste your deliverable link..."
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 p-4 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed resize-none transition-all"
          />
        </div>

        {!isSubmitted && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
              className="font-bold flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" /> Submit Assignment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
