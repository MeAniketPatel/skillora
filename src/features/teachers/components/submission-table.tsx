"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gradeSubmission } from "@/features/assignments";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Submission {
  id: string;
  content: string;
  attachmentUrl: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  submittedAt: Date;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  lesson: {
    id: string;
    title: string;
  };
}

interface SubmissionTableProps {
  initialSubmissions: Submission[];
  courseId: string;
}

export function SubmissionTable({ initialSubmissions, courseId }: SubmissionTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState<number>(100);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setError(null);
    startTransition(async () => {
      const res = await gradeSubmission(selectedSubmission.id, score, feedback);
      if (!res.success) {
        setError(res.error || "Failed to grade submission.");
      } else {
        setSelectedSubmission(null);
        setFeedback("");
        router.refresh();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List / Table */}
      <div className={cn("lg:col-span-2 space-y-4", selectedSubmission && "lg:col-span-2")}>
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-0">
            {initialSubmissions.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 italic text-sm">
                No submissions have been uploaded for assignments in this course.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                      <TableHead className="py-3.5 pl-6">Student</TableHead>
                      <TableHead className="py-3.5">Assignment</TableHead>
                      <TableHead className="py-3.5">Submitted</TableHead>
                      <TableHead className="py-3.5">Status</TableHead>
                      <TableHead className="py-3.5 pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialSubmissions.map((s) => {
                      const isGraded = s.status === "GRADED";
                      return (
                        <TableRow
                          key={s.id}
                          className={cn(
                            "border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10",
                            selectedSubmission?.id === s.id && "bg-neutral-50/50 dark:bg-neutral-950/30"
                          )}
                        >
                          <TableCell className="py-4 pl-6 flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={s.user.image || ""} />
                              <AvatarFallback className="bg-neutral-100 dark:bg-neutral-850">
                                <User className="h-3.5 w-3.5 text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 text-xs">
                              <span className="font-bold truncate text-neutral-850 dark:text-neutral-50">
                                {s.user.name || "Student"}
                              </span>
                              <span className="text-[10px] text-neutral-400 truncate">
                                {s.user.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {s.lesson.title}
                          </TableCell>
                          <TableCell className="py-4 text-xs text-neutral-500">
                            {new Date(s.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-4">
                            {isGraded ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                <CheckCircle className="h-3 w-3" />
                                Graded ({s.score}/100)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                                <AlertCircle className="h-3 w-3" />
                                Pending Review
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 pr-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(s);
                                setScore(s.score || 100);
                                setFeedback(s.feedback || "");
                                setError(null);
                              }}
                              className="text-xs rounded-xl h-8 px-3"
                            >
                              {isGraded ? "Edit Grade" : "Grade"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grading Form Panel */}
      {selectedSubmission && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-md h-fit sticky top-20">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">Grade Submission</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Submitted by {selectedSubmission.user.name || selectedSubmission.user.email}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-950/20 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Submission content</span>
                <p className="text-xs text-neutral-700 dark:text-neutral-355 mt-1 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.content}
                </p>
                {selectedSubmission.attachmentUrl && (
                  <a
                    href={selectedSubmission.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary mt-3 hover:underline"
                  >
                    Download Attachment 📁
                  </a>
                )}
              </div>

              <form onSubmit={handleGrade} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="score" className="text-xs font-bold">Score (0 - 100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value, 10))}
                    required
                    disabled={isPending}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-xs font-bold">Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student..."
                    disabled={isPending}
                    className="rounded-xl resize-none text-xs"
                  />
                </div>

                {error && (
                  <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl h-10 text-xs"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Submit Grade"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedSubmission(null)}
                    disabled={isPending}
                    className="rounded-xl h-10 text-xs px-4"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
