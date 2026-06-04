"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveCourse, rejectCourse } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  teacher: {
    name: string | null;
    email: string;
  };
}

interface CourseModerationProps {
  initialCourses: Course[];
}

export function CourseModeration({ initialCourses }: CourseModerationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const handleApprove = (id: string) => {
    setActiveId(id);
    startTransition(async () => {
      const res = await approveCourse(id);
      if (res.success) {
        router.refresh();
      }
      setActiveId(null);
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || !reason.trim()) return;

    setActiveId(rejectingId);
    startTransition(async () => {
      const res = await rejectCourse(rejectingId, reason);
      if (res.success) {
        setRejectingId(null);
        setReason("");
        router.refresh();
      }
      setActiveId(null);
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {initialCourses.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 italic text-sm">
              No courses found matching filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <TableHead className="py-3.5 pl-6">Course</TableHead>
                    <TableHead className="py-3.5">Teacher</TableHead>
                    <TableHead className="py-3.5">Status</TableHead>
                    <TableHead className="py-3.5">Submitted</TableHead>
                    <TableHead className="py-3.5 pr-6 text-right">Moderation Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialCourses.map((c) => (
                    <TableRow key={c.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10">
                      <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {c.title}
                      </TableCell>
                      <TableCell className="py-4 text-xs text-neutral-550">
                        <div>{c.teacher.name || "Instructor"}</div>
                        <div className="text-[10px] text-neutral-400">{c.teacher.email}</div>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-semibold">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                          c.status === "PUBLISHED" && "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
                          c.status === "DRAFT" && "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
                          c.status === "UNDER_REVIEW" && "bg-yellow-50 text-yellow-755 dark:bg-yellow-950/20 dark:text-yellow-400"
                        )}>
                          {c.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-neutral-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right space-x-2">
                        {c.status === "UNDER_REVIEW" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isPending}
                              onClick={() => handleApprove(c.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg"
                              aria-label="Approve Course"
                            >
                              {isPending && activeId === c.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isPending}
                              onClick={() => setRejectingId(c.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                              aria-label="Reject Course"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Modal Panel */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-2xl p-6">
            <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-2">Reject Course</h3>
            <p className="text-[10px] text-neutral-400 mb-4">Provide a reason for rejection. This description will be sent to the teacher.</p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Reason for revision required (e.g. video placeholder, incomplete section)..."
                rows={4}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-850 bg-transparent p-3 text-xs leading-relaxed outline-none resize-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="submit"
                  disabled={isPending || !reason.trim()}
                  className="rounded-xl text-xs h-9"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm Reject"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectingId(null);
                    setReason("");
                  }}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
