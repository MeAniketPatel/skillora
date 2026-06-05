"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createQuiz, updateQuiz } from "@/features/quizzes";
import { generateAIQuizQuestions } from "@/features/ai";

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: QuestionOption[];
  explanation?: string;
}

interface QuizBuilderProps {
  lessonId: string;
  initialQuiz: {
    id: string;
    title: string;
    passingScore: number;
    questions: {
      id: string;
      question: string;
      options: any;
      explanation: string | null;
    }[];
  } | null;
}

export default function QuizBuilder({ lessonId, initialQuiz }: QuizBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [quizId, setQuizId] = useState<string | null>(initialQuiz?.id || null);
  const [title, setTitle] = useState(initialQuiz?.title || "Lesson Quiz");
  const [passingScore, setPassingScore] = useState(initialQuiz?.passingScore || 70);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIQuestions = async () => {
    if (!title || !title.trim()) return;
    setIsGeneratingAI(true);
    try {
      const res = await generateAIQuizQuestions(title);
      if (res.success && res.data.questions) {
        setQuestions([...questions, ...res.data.questions]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions.map((q) => ({
      question: q.question,
      options: q.options as QuestionOption[],
      explanation: q.explanation || "",
    })) || []
  );

  const handleCreateQuiz = () => {
    startTransition(async () => {
      const res = await createQuiz(lessonId, title, passingScore);
      if (res.success && res.data) {
        setQuizId(res.data.id);
      }
    });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
        ],
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestionText = (idx: number, text: string) => {
    setQuestions(
      questions.map((q, i) => (i === idx ? { ...q, question: text } : q))
    );
  };

  const updateExplanationText = (idx: number, text: string) => {
    setQuestions(
      questions.map((q, i) => (i === idx ? { ...q, explanation: text } : q))
    );
  };

  const addOption = (qIdx: number) => {
    setQuestions(
      questions.map((q, idx) => {
        if (idx === qIdx) {
          return {
            ...q,
            options: [...q.options, { text: `Option ${String.fromCharCode(65 + q.options.length)}`, isCorrect: false }],
          };
        }
        return q;
      })
    );
  };

  const removeOption = (qIdx: number, optIdx: number) => {
    setQuestions(
      questions.map((q, idx) => {
        if (idx === qIdx) {
          const filtered = q.options.filter((_, i) => i !== optIdx);
          // Auto-mark first as correct if we deleted the correct one
          if (filtered.length > 0 && !filtered.some((o) => o.isCorrect)) {
            filtered[0].isCorrect = true;
          }
          return { ...q, options: filtered };
        }
        return q;
      })
    );
  };

  const updateOptionText = (qIdx: number, optIdx: number, text: string) => {
    setQuestions(
      questions.map((q, idx) => {
        if (idx === qIdx) {
          return {
            ...q,
            options: q.options.map((o, oi) => (oi === optIdx ? { ...o, text } : o)),
          };
        }
        return q;
      })
    );
  };

  const setCorrectOption = (qIdx: number, optIdx: number) => {
    setQuestions(
      questions.map((q, idx) => {
        if (idx === qIdx) {
          return {
            ...q,
            options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === optIdx })),
          };
        }
        return q;
      })
    );
  };

  const handleSave = () => {
    if (!quizId) return;
    startTransition(async () => {
      const res = await updateQuiz(quizId, title, passingScore, questions);
      if (res.success) {
        alert("Quiz saved successfully!");
      } else {
        alert(res.error || "Failed to save quiz.");
      }
    });
  };

  return (
    <div className="space-y-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Quiz Configuration</h3>
        <p className="text-sm text-neutral-500">Configure questions, answer keys, and passing thresholds.</p>
      </div>

      {!quizId ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quizTitle">Quiz Title</Label>
            <Input id="quizTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <Button onClick={handleCreateQuiz} disabled={isPending}>
            Initialize Quiz Structure
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quizTitle">Quiz Title</Label>
              <Input id="quizTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing">Passing Score (%)</Label>
              <Input
                id="passing"
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Questions</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAIQuestions}
                disabled={isPending || isGeneratingAI}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 h-7 font-bold px-2 hover:bg-indigo-50/20"
              >
                <Sparkles className="h-3 w-3" /> {isGeneratingAI ? "Generating..." : "Generate AI Questions"}
              </Button>
            </div>
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-xs uppercase text-neutral-400">Question {qIdx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIdx)} className="h-6 w-6 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Input value={q.question} onChange={(e) => updateQuestionText(qIdx, e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectOption(qIdx, optIdx)}
                          className="shrink-0 text-neutral-500 hover:text-green-600"
                        >
                          {opt.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 fill-current" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <Input
                          value={opt.text}
                          onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                          className="h-8"
                        />
                        {q.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(qIdx, optIdx)}
                            className="h-8 w-8 text-neutral-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addOption(qIdx)} className="h-8">
                      <Plus className="h-4 w-4 mr-1" /> Add Option
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Input
                    placeholder="Brief explanation shown to students after attempt"
                    value={q.explanation}
                    onChange={(e) => updateExplanationText(qIdx, e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button onClick={addQuestion} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>

          <Button onClick={handleSave} disabled={isPending} className="w-full">
            Save Quiz Details
          </Button>
        </div>
      )}
    </div>
  );
}
