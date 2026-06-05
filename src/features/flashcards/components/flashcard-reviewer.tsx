"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { reviewCardAction } from "@/actions/flashcard.actions";
import { toast } from "sonner";
import { ArrowLeft, RotateCw, CheckCircle2, Award, ChevronRight, HelpCircle } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  progress?: any[];
}

interface FlashcardReviewerProps {
  deckTitle: string;
  flashcards: Flashcard[];
}

const SCORE_LABELS = [
  { value: 0, label: "0 - Blackout", desc: "Complete forgetfulness", color: "bg-red-500 hover:bg-red-600 text-white" },
  { value: 1, label: "1 - Wrong", desc: "Incorrect, but felt familiar", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { value: 2, label: "2 - Wrong", desc: "Incorrect, but easy to recall", color: "bg-amber-500 hover:bg-amber-600 text-white" },
  { value: 3, label: "3 - Hard", desc: "Correct, but serious effort", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { value: 4, label: "4 - Good", desc: "Correct, with a brief pause", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { value: 5, label: "5 - Easy", desc: "Correct, perfect response", color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
];

export function FlashcardReviewer({ deckTitle, flashcards }: FlashcardReviewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl max-w-md mx-auto text-center shadow-sm">
        <HelpCircle className="h-12 w-12 text-neutral-400 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">No cards to review!</h3>
        <p className="text-sm text-neutral-500 mt-2">Add some flashcards to your deck or check back later.</p>
        <Button onClick={() => router.push("/student/flashcards")} className="mt-6" variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Decks
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progressPercent = Math.round((currentIndex / flashcards.length) * 100);

  const handleScoreSelect = async (score: number) => {
    setIsSubmitting(true);
    try {
      const res = await reviewCardAction(currentCard.id, score);
      if (!res.success) {
        toast.error(res.error || "Failed to update review progress");
      } else {
        toast.success("Progress saved!", { duration: 1000 });
        
        if (currentIndex < flashcards.length - 1) {
          setIsFlipped(false);
          // Wait slightly for flip back transition before changing card content
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 300);
        } else {
          setSessionCompleted(true);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl max-w-md mx-auto text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Deck Review Completed!</h3>
        <p className="text-sm text-neutral-500 mt-2 max-w-xs">
          Great job! You&apos;ve completed reviewing all the cards in <strong className="text-neutral-700 dark:text-neutral-300">{deckTitle}</strong>.
        </p>
        <div className="flex items-center gap-2 mt-6 p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl w-full">
          <Award className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">SM-2 Spaced Repetition</h4>
            <p className="text-[10px] text-neutral-500">Next study sessions scheduled based on memory strength.</p>
          </div>
        </div>
        <Button onClick={() => router.push("/student/flashcards")} className="mt-6 w-full">
          Back to Decks
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Top Bar / Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.push("/student/flashcards")}
          variant="ghost"
          size="sm"
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-right">
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">{deckTitle}</h4>
          <span className="text-[10px] text-neutral-500 font-mono">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-neutral-450 font-medium">
          <span>Review Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Flashcard 3D container */}
      <div 
        className="relative h-72 w-full cursor-pointer perspective-1000 group"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div 
          className={`relative w-full h-full duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Card className="w-full h-full flex flex-col justify-between p-6 border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 shadow-md rounded-2xl hover:border-neutral-350 dark:hover:border-neutral-700 transition-colors">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Question / Concept</div>
              <div className="flex items-center justify-center flex-1 text-center py-4">
                <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100 whitespace-pre-wrap">
                  {currentCard.front}
                </p>
              </div>
              <div className="flex items-center justify-center text-xs text-neutral-400 gap-1.5 font-medium animate-pulse">
                <RotateCw className="h-3 w-3" /> Click card to reveal answer
              </div>
            </Card>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Card className="w-full h-full flex flex-col justify-between p-6 border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 shadow-md rounded-2xl">
              <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Answer / Explanation</div>
              <div className="flex items-center justify-center flex-1 text-center py-4 overflow-y-auto">
                <p className="text-md text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
                  {currentCard.back}
                </p>
              </div>
              <div className="flex items-center justify-center text-xs text-neutral-400 gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Card Flipped
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Grade Selector (only show if flipped) */}
      <div className={`transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="text-center">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">How well did you remember this?</h4>
            <p className="text-[10px] text-neutral-450 mt-0.5">Select a score to update your spaced repetition interval.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SCORE_LABELS.map((item) => (
              <Button
                key={item.value}
                disabled={isSubmitting}
                onClick={() => handleScoreSelect(item.value)}
                variant="outline"
                className={`h-auto py-2.5 px-3 flex flex-col items-center justify-center rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 transition-all hover:scale-[1.02] active:scale-[0.98] ${item.color}`}
              >
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[8px] opacity-90 mt-0.5 font-normal line-clamp-1">{item.desc}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind helper classes injected for 3D flip if not already defined */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
