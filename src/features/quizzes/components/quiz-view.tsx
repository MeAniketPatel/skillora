"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { submitQuizAttempt } from "@/features/quizzes";
import { toggleLessonCompletion } from "@/features/enrollment";

interface Question {
  id: string;
  question: string;
  options: any;
  explanation: string | null;
}

interface Attempt {
  id: string;
  score: number;
  passed: boolean;
  answers: any;
  submittedAt: Date | null;
}

interface QuizViewProps {
  courseId: string;
  lessonId: string;
  quiz: {
    id: string;
    title: string;
    passingScore: number;
    questions: Question[];
    attempts?: Attempt[];
  };
}

export default function QuizView({ courseId, lessonId, quiz }: QuizViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(
    quiz.attempts && quiz.attempts.length > 0 ? quiz.attempts[0] : null
  );
  const [optimisticPassed, setOptimisticPassed] = useState(false);

  const isQuizPassed = optimisticPassed || quiz.attempts?.some((a) => a.passed) || (showResults && (lastAttempt?.passed ?? false));

  const handleSelectOption = (questionId: string, optionText: string) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    startTransition(async () => {
      setOptimisticPassed(true);
      const res = await submitQuizAttempt(quiz.id, answers);
      if (!res.success) {
        setOptimisticPassed(false);
        alert(res.error);
      } else {
        const attempt = res.data;
        setLastAttempt(attempt as any);
        setShowResults(true);
        if (attempt.passed) {
          await toggleLessonCompletion(courseId, lessonId, true);
        }
        router.refresh();
      }
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setLastAttempt(null);
  };

  if (lastAttempt && !showResults) {
    return (
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            {lastAttempt.passed ? (
              <Award className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            {lastAttempt.passed ? "You passed this quiz!" : "Quiz attempt failed"}
          </CardTitle>
          <CardDescription className="text-sm">
            Passing score: {quiz.passingScore}%. Your score: {Math.round(lastAttempt.score)}%
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={resetQuiz} className="w-full sm:w-auto">
            Try Again / Review Answers
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>Answer all questions to pass the quiz ({quiz.passingScore}% passing threshold).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const parsedOpts = typeof q.options === "string" ? (() => { try { return JSON.parse(q.options); } catch { return []; } })() : Array.isArray(q.options) ? q.options : [];
          const opts = parsedOpts as { text: string; isCorrect: boolean }[];
          const selectedVal = answers[q.id];
          const isCorrectAnswer = opts.find((o) => o.isCorrect)?.text === selectedVal;

          return (
            <div key={q.id} className="space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 last:pb-0">
              <p className="font-semibold text-sm">
                {idx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {opts.map((opt) => {
                  const isSelected = selectedVal === opt.text;
                  let optStyle = "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50";
                  
                  if (isSelected) {
                    optStyle = "border-primary bg-primary/10 text-primary";
                  }

                  if (showResults) {
                    if (opt.isCorrect) {
                      optStyle = "border-green-600 bg-green-500/10 text-green-600 font-medium";
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = "border-red-600 bg-red-500/10 text-red-600";
                    }
                  }

                  return (
                    <button
                      key={opt.text}
                      type="button"
                      disabled={showResults || isPending}
                      onClick={() => handleSelectOption(q.id, opt.text)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-colors ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {showResults && (
                        opt.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                        ) : null
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && q.explanation && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg text-[11px] text-neutral-500 mt-2">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Explanation:</span> {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {!showResults ? (
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            Submit Answers
          </Button>
        ) : (
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/50 text-center">
            <div className={`p-4 rounded-lg font-bold text-sm ${
              lastAttempt?.passed 
                ? "bg-green-50 dark:bg-green-950/20 text-green-600" 
                : "bg-red-50 dark:bg-red-950/20 text-red-600"
            }`}>
              {lastAttempt?.passed 
                ? `Passed! Score: ${Math.round(lastAttempt.score)}%` 
                : `Failed. Score: ${Math.round(lastAttempt?.score || 0)}%`}
            </div>
            <Button onClick={resetQuiz} variant="outline" className="w-full">
              Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
