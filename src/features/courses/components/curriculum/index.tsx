"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createLesson,
  createSection,
  deleteLesson,
  deleteSection,
  reorderLessons,
  reorderSections,
  updateLesson,
  updateSection,
} from "../../actions/course.actions";
import { SectionCard } from "./section-card";
import { AddSectionForm } from "./add-section-form";
import type { CurriculumSection } from "./curriculum.shared";

interface CurriculumBuilderProps {
  courseId: string;
  initialSections: CurriculumSection[];
}

export default function CurriculumBuilder({
  courseId,
  initialSections,
}: CurriculumBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<CurriculumSection[]>(initialSections);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const refresh = () => router.refresh();

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    startTransition(async () => {
      const res = await createSection(courseId, newSectionTitle);
      if (res.success && res.data) {
        const newSection: CurriculumSection = {
          id: res.data.id,
          title: res.data.title,
          position: res.data.position,
          lessons: [],
        };
        setSections([...sections, newSection]);
        setNewSectionTitle("");
        refresh();
      }
    });
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    startTransition(async () => {
      const res = await updateSection(courseId, sectionId, title);
      if (res.success) {
        setSections(
          sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
        );
        refresh();
      }
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    startTransition(async () => {
      const res = await deleteSection(courseId, sectionId);
      if (res.success) {
        setSections(sections.filter((s) => s.id !== sectionId));
        refresh();
      }
    });
  };

  const handleAddLesson = (sectionId: string, title: string) => {
    if (!title.trim()) return;
    startTransition(async () => {
      const res = await createLesson(courseId, sectionId, title);
      if (res.success && res.data) {
        setSections(
          sections.map((s) =>
            s.id === sectionId
              ? { ...s, lessons: [...s.lessons, res.data as CurriculumSection["lessons"][number]] }
              : s,
          ),
        );
        refresh();
      }
    });
  };

  const handleUpdateLessonTitle = (
    sectionId: string,
    lessonId: string,
    title: string,
  ) => {
    if (!title.trim()) return;
    startTransition(async () => {
      const res = await updateLesson(courseId, sectionId, lessonId, { title });
      if (res.success) {
        setSections(
          sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId ? { ...l, title } : l,
                  ),
                }
              : s,
          ),
        );
        refresh();
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
          sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId ? { ...l, isFree: !currentVal } : l,
                  ),
                }
              : s,
          ),
        );
        refresh();
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
          sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId ? { ...l, isPublished: !currentVal } : l,
                  ),
                }
              : s,
          ),
        );
        refresh();
      }
    });
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    startTransition(async () => {
      const res = await deleteLesson(courseId, sectionId, lessonId);
      if (res.success) {
        setSections(
          sections.map((s) =>
            s.id === sectionId
              ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
              : s,
          ),
        );
        refresh();
      }
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
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
      refresh();
    });
  };

  const moveLesson = (
    sectionId: string,
    lessonId: string,
    direction: "up" | "down",
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const lessonIndex = section.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) return;

    const newLessonIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (newLessonIndex < 0 || newLessonIndex >= section.lessons.length) return;

    const newLessons = [...section.lessons];
    [newLessons[lessonIndex], newLessons[newLessonIndex]] = [
      newLessons[newLessonIndex],
      newLessons[lessonIndex],
    ];
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
      refresh();
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {sections.map((section, sIdx) => (
          <SectionCard
            key={section.id}
            section={section}
            index={sIdx}
            totalSections={sections.length}
            courseId={courseId}
            isPending={isPending}
            onUpdateTitle={(title) => handleUpdateSectionTitle(section.id, title)}
            onDelete={() => handleDeleteSection(section.id)}
            onMove={(direction) => moveSection(sIdx, direction)}
            onAddLesson={(title) => handleAddLesson(section.id, title)}
            onUpdateLessonTitle={(lessonId, title) =>
              handleUpdateLessonTitle(section.id, lessonId, title)
            }
            onToggleLessonFree={(lessonId, val) =>
              handleToggleLessonFree(section.id, lessonId, val)
            }
            onToggleLessonPublish={(lessonId, val) =>
              handleToggleLessonPublish(section.id, lessonId, val)
            }
            onDeleteLesson={(lessonId) => handleDeleteLesson(section.id, lessonId)}
            onMoveLesson={(lessonId, direction) =>
              moveLesson(section.id, lessonId, direction)
            }
          />
        ))}
      </div>
      <div className="space-y-6">
        <AddSectionForm
          value={newSectionTitle}
          onChange={setNewSectionTitle}
          onSubmit={handleAddSection}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
