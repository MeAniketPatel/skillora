"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Layers,
  Settings,
  CheckCircle,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderSections,
  reorderLessons,
} from "@/actions/course.actions";

interface Lesson {
  id: string;
  title: string;
  type: string;
  isFree: boolean;
  isPublished: boolean;
  position: number;
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface CurriculumBuilderProps {
  courseId: string;
  initialSections: Section[];
}

export default function CurriculumBuilder({
  courseId,
  initialSections,
}: CurriculumBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newLessonTitles, setNewLessonTitles] = useState<{
    [sectionId: string]: string;
  }>({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    startTransition(async () => {
      const res = await createSection(courseId, newSectionTitle);
      if (res.success && res.data) {
        setSections([...sections, { ...res.data, lessons: [] }]);
        setNewSectionTitle("");
        router.refresh();
      }
    });
  };

  const handleUpdateSectionTitle = (sectionId: string) => {
    if (!editingSectionTitle.trim()) return;
    startTransition(async () => {
      const res = await updateSection(courseId, sectionId, editingSectionTitle);
      if (res.success) {
        setSections(
          sections.map((s) =>
            s.id === sectionId ? { ...s, title: editingSectionTitle } : s,
          ),
        );
        setEditingSectionId(null);
        router.refresh();
      }
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    startTransition(async () => {
      const res = await deleteSection(courseId, sectionId);
      if (res.success) {
        setSections(sections.filter((s) => s.id !== sectionId));
        router.refresh();
      }
    });
  };

  const handleAddLesson = (sectionId: string) => {
    const title = newLessonTitles[sectionId];
    if (!title || !title.trim()) return;

    startTransition(async () => {
      const res = await createLesson(courseId, sectionId, title);
      if (res.success && res.data) {
        setSections(
          sections.map((s) => {
            if (s.id === sectionId) {
              return { ...s, lessons: [...s.lessons, res.data as Lesson] };
            }
            return s;
          }),
        );
        setNewLessonTitles({ ...newLessonTitles, [sectionId]: "" });
        router.refresh();
      }
    });
  };

  const handleUpdateLessonTitle = (sectionId: string, lessonId: string) => {
    if (!editingLessonTitle.trim()) return;
    startTransition(async () => {
      const res = await updateLesson(courseId, sectionId, lessonId, {
        title: editingLessonTitle,
      });
      if (res.success) {
        setSections(
          sections.map((s) => {
            if (s.id === sectionId) {
              return {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, title: editingLessonTitle } : l,
                ),
              };
            }
            return s;
          }),
        );
        setEditingLessonId(null);
        router.refresh();
      }
    });
  };

  const handleToggleLessonFree = (
    sectionId: string,
    lessonId: string,
    currentVal: boolean,
  ) => {
    startTransition(async () => {
      const res = await updateLesson(courseId, sectionId, lessonId, {
        isFree: !currentVal,
      });
      if (res.success) {
        setSections(
          sections.map((s) => {
            if (s.id === sectionId) {
              return {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, isFree: !currentVal } : l,
                ),
              };
            }
            return s;
          }),
        );
        router.refresh();
      }
    });
  };

  const handleToggleLessonPublish = (
    sectionId: string,
    lessonId: string,
    currentVal: boolean,
  ) => {
    startTransition(async () => {
      const res = await updateLesson(courseId, sectionId, lessonId, {
        isPublished: !currentVal,
      });
      if (res.success) {
        setSections(
          sections.map((s) => {
            if (s.id === sectionId) {
              return {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, isPublished: !currentVal } : l,
                ),
              };
            }
            return s;
          }),
        );
        router.refresh();
      }
    });
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    startTransition(async () => {
      const res = await deleteLesson(courseId, sectionId, lessonId);
      if (res.success) {
        setSections(
          sections.map((s) => {
            if (s.id === sectionId) {
              return {
                ...s,
                lessons: s.lessons.filter((l) => l.id !== lessonId),
              };
            }
            return s;
          }),
        );
        router.refresh();
      }
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;

    // Recalculate positions
    const reordered = newSections.map((s, idx) => ({
      ...s,
      position: idx + 1,
    }));

    setSections(reordered);
    startTransition(async () => {
      await reorderSections(
        courseId,
        reordered.map((s) => ({ id: s.id, position: s.position })),
      );
      router.refresh();
    });
  };

  const moveLesson = (
    sectionId: string,
    lessonIndex: number,
    direction: "up" | "down",
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newLessonIndex =
      direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (newLessonIndex < 0 || newLessonIndex >= section.lessons.length) return;

    const newLessons = [...section.lessons];
    const temp = newLessons[lessonIndex];
    newLessons[lessonIndex] = newLessons[newLessonIndex];
    newLessons[newLessonIndex] = temp;

    const reorderedLessons = newLessons.map((l, idx) => ({
      ...l,
      position: idx + 1,
    }));

    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, lessons: reorderedLessons } : s,
      ),
    );
    startTransition(async () => {
      await reorderLessons(
        courseId,
        sectionId,
        reorderedLessons.map((l) => ({ id: l.id, position: l.position })),
      );
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <LinkButton
          variant="ghost"
          size="icon"
          href={`/teacher/courses/${courseId}`}
        >
          <ArrowLeft className="h-4 w-4" />
        </LinkButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Curriculum Builder
          </h1>
          <p className="text-sm text-neutral-500">
            Organize sections and lessons for your students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Builder list */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, sIdx) => (
            <Card
              key={section.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50"
            >
              <CardHeader className="p-4 flex flex-row items-center justify-between gap-x-2 space-y-0">
                <div className="flex items-center gap-x-2 flex-1 min-w-0">
                  <Layers className="h-4 w-4 text-neutral-400 shrink-0" />
                  {editingSectionId === section.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingSectionTitle}
                        onChange={(e) => setEditingSectionTitle(e.target.value)}
                        className="h-8 max-w-[240px]"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateSectionTitle(section.id)}
                        disabled={isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingSectionId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingSectionId(section.id);
                        setEditingSectionTitle(section.title);
                      }}
                      className="font-semibold text-base cursor-pointer hover:underline truncate"
                    >
                      {section.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-x-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveSection(sIdx, "up")}
                    disabled={sIdx === 0 || isPending}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveSection(sIdx, "down")}
                    disabled={sIdx === sections.length - 1 || isPending}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteSection(section.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {/* Lessons list */}
                {section.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800/50 gap-x-2"
                  >
                    <div className="flex items-center gap-x-2 flex-1 min-w-0">
                      <BookOpen className="h-4 w-4 text-neutral-400 shrink-0" />
                      {editingLessonId === lesson.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingLessonTitle}
                            onChange={(e) =>
                              setEditingLessonTitle(e.target.value)
                            }
                            className="h-8 max-w-[200px]"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateLessonTitle(section.id, lesson.id)
                            }
                            disabled={isPending}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingLessonId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingLessonId(lesson.id);
                            setEditingLessonTitle(lesson.title);
                          }}
                          className="text-sm cursor-pointer hover:underline truncate"
                        >
                          {lesson.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-x-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleLessonFree(
                            section.id,
                            lesson.id,
                            lesson.isFree,
                          )
                        }
                        className={`h-7 px-2 text-[10px] uppercase font-bold ${lesson.isFree ? "text-green-600 bg-green-50 dark:bg-green-950/20" : "text-neutral-500"}`}
                      >
                        Free
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleLessonPublish(
                            section.id,
                            lesson.id,
                            lesson.isPublished,
                          )
                        }
                        className={`h-7 px-2 text-[10px] uppercase font-bold ${lesson.isPublished ? "text-blue-600 bg-blue-50 dark:bg-blue-950/20" : "text-neutral-500"}`}
                      >
                        {lesson.isPublished ? "Published" : "Draft"}
                      </Button>
                      <LinkButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        href={`/teacher/courses/${courseId}/lessons/${lesson.id}`}
                      >
                        <Settings className="h-4 w-4" />
                      </LinkButton>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveLesson(section.id, lIdx, "up")}
                        disabled={lIdx === 0 || isPending}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveLesson(section.id, lIdx, "down")}
                        disabled={
                          lIdx === section.lessons.length - 1 || isPending
                        }
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() =>
                          handleDeleteLesson(section.id, lesson.id)
                        }
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Create lesson input */}
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder="New lesson title..."
                    value={newLessonTitles[section.id] || ""}
                    onChange={(e) =>
                      setNewLessonTitles({
                        ...newLessonTitles,
                        [section.id]: e.target.value,
                      })
                    }
                    className="h-8 text-sm"
                    disabled={isPending}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddLesson(section.id)}
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right column: Create Section */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Add Section</CardTitle>
              <CardDescription>
                Create a new container section for lessons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secTitle">Section Title</Label>
                <Input
                  id="secTitle"
                  placeholder="e.g. 'Introduction to React'"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <Button
                onClick={handleAddSection}
                disabled={isPending}
                className="w-full"
              >
                Create Section
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
