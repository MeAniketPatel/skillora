"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { gradeSubmission } from "@/actions/assignment.actions";
import type { AnalyticsSubmission } from "./analytics.shared";

interface AnalyticsSubmissionsProps {
  submissions: AnalyticsSubmission[];
  onGraded: (id: string, score: number, feedback: string) => void;
}

export function AnalyticsSubmissions({
  submissions,
  onGraded,
}: AnalyticsSubmissionsProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader>
        <CardTitle>Deliverables & Assignment Reviews</CardTitle>
        <CardDescription>
          Evaluate student assignments and publish grading feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-xs text-neutral-400 italic">
            No assignment submissions recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <SubmissionRow
                key={sub.id}
                submission={sub}
                onGraded={onGraded}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubmissionRow({
  submission,
  onGraded,
}: {
  submission: AnalyticsSubmission;
  onGraded: (id: string, score: number, feedback: string) => void;
}) {
  const [gradingMode, setGradingMode] = useState(false);
  const [score, setScore] = useState(100);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleGrade = () => {
    startTransition(async () => {
      const res = await gradeSubmission(submission.id, score, feedback);
      if (res.success) {
        onGraded(submission.id, score, feedback);
        setGradingMode(false);
        setFeedback("");
      }
    });
  };

  return (
    <div className="p-4 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 space-y-3">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {submission.user.name || submission.user.email}
          </h4>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            {submission.lesson.section.course.title} → {submission.lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {submission.status === "GRADED" ? (
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
              Score: {submission.score}/100
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full animate-pulse">
              Pending Review
            </span>
          )}

          {submission.status !== "GRADED" && !gradingMode && (
            <Button
              size="sm"
              className="h-7 text-xs font-bold"
              onClick={() => setGradingMode(true)}
            >
              Grade Deliverable
            </Button>
          )}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200/50 dark:border-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-300 font-mono whitespace-pre-wrap">
        {submission.content}
      </div>

      {gradingMode && (
        <GradingForm
          score={score}
          setScore={setScore}
          feedback={feedback}
          setFeedback={setFeedback}
          onSubmit={handleGrade}
          onCancel={() => setGradingMode(false)}
          isPending={isPending}
        />
      )}

      {submission.status === "GRADED" && submission.feedback && (
        <div className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-100 dark:border-neutral-800/50">
          Feedback: &quot;{submission.feedback}&quot;
        </div>
      )}
    </div>
  );
}

function GradingForm({
  score,
  setScore,
  feedback,
  setFeedback,
  onSubmit,
  onCancel,
  isPending,
}: {
  score: number;
  setScore: (n: number) => void;
  feedback: string;
  setFeedback: (s: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in-50 duration-150">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Score (0-100)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
            Feedback comments
          </label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Great work on this task..."
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-xs w-full"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="h-8 text-xs font-semibold"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isPending}
          className="h-8 text-xs font-bold"
        >
          Submit Grade
        </Button>
      </div>
    </div>
  );
}
