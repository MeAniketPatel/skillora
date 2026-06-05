export interface CurriculumLesson {
  id: string;
  title: string;
  type: string;
  isFree: boolean;
  isPublished: boolean;
  position: number;
}

export interface CurriculumSection {
  id: string;
  title: string;
  position: number;
  lessons: CurriculumLesson[];
}

export interface CurriculumBuilderCallbacks {
  onAddSection: (title: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddLesson: (sectionId: string, title: string) => void;
  onUpdateLessonTitle: (sectionId: string, lessonId: string, title: string) => void;
  onToggleLessonFree: (sectionId: string, lessonId: string, currentVal: boolean) => void;
  onToggleLessonPublish: (sectionId: string, lessonId: string, currentVal: boolean) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onMoveSection: (index: number, direction: "up" | "down") => void;
  onMoveLesson: (sectionId: string, index: number, direction: "up" | "down") => void;
}
