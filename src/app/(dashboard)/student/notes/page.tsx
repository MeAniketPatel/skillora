import { requireAuth } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { getAllUserNotes } from "@/features/students/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";
import { ArrowRight, BookOpen, Clock, FileText } from "lucide-react";

function formatTimestamp(seconds: number | null) {
  if (seconds === null || seconds === undefined) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default async function StudentNotesPage() {
  const user = await requireAuth();

  const { notes } = await getAllUserNotes(user.id, { limit: 100 });

  // Group notes by course and then by lesson
  const notesByCourse: Record<
    string,
    {
      title: string;
      slug: string;
      lessons: Record<
        string,
        {
          title: string;
          lessonId: string;
          notes: typeof notes;
        }
      >;
    }
  > = {};

  notes.forEach((note) => {
    const course = note.lesson.section.course;
    const courseId = course.id;
    const lesson = note.lesson;
    const lessonId = lesson.id;

    if (!notesByCourse[courseId]) {
      notesByCourse[courseId] = {
        title: course.title,
        slug: course.slug,
        lessons: {},
      };
    }

    if (!notesByCourse[courseId].lessons[lessonId]) {
      notesByCourse[courseId].lessons[lessonId] = {
        title: lesson.title,
        lessonId: lessonId,
        notes: [],
      };
    }

    notesByCourse[courseId].lessons[lessonId].notes.push(note);
  });

  const courseList = Object.entries(notesByCourse);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Study Notes"
        description="Review all notes you have taken during lectures, sorted by course and lesson."
      />

      {courseList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
          <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
            <FileText className="h-7 w-7 text-neutral-400" />
          </div>
          <CardTitle className="text-xl font-bold">No notes found</CardTitle>
          <CardDescription className="max-w-sm mt-2 text-sm text-neutral-500">
            You haven't taken any study notes yet. You can create notes inside the lesson learning player.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-8">
          {courseList.map(([courseId, course]) => (
            <div key={courseId} className="space-y-4">
              <div className="flex items-center gap-x-2 border-b border-neutral-200/60 dark:border-neutral-800 pb-2">
                <BookOpen className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-xl font-bold tracking-tight">
                  {course.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {Object.entries(course.lessons).map(([lessonId, lesson]) => (
                  <Card
                    key={lessonId}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/50 flex flex-row items-center justify-between gap-4 space-y-0">
                      <CardTitle className="text-sm font-bold truncate">
                        {lesson.title}
                      </CardTitle>
                      <Link
                        href={`/learn/${courseId}/${lessonId}`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "text-xs rounded-xl flex items-center gap-1 shrink-0 h-8",
                        })}
                      >
                        Study Lesson <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {lesson.notes.map((note) => {
                        const time = formatTimestamp(note.timestamp);
                        return (
                          <div
                            key={note.id}
                            className="p-4 rounded-xl bg-neutral-50/40 dark:bg-neutral-950/10 border border-neutral-200/40 dark:border-neutral-850 flex gap-3 text-xs leading-relaxed"
                          >
                            {time && (
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded-md h-fit">
                                <Clock className="h-3 w-3" />
                                <span>{time}</span>
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <p className="text-neutral-750 dark:text-neutral-200 whitespace-pre-wrap">
                                {note.content}
                              </p>
                              <span className="text-[9px] text-neutral-400 block font-medium">
                                Created on {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
