import type { Metadata } from "next";
import { getDecksForUser } from "@/features/flashcards/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DeckList } from "@/features/flashcards/server";
import { Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export const metadata: Metadata = {
  title: "Flashcards Study",
  description: "Improve learning retention using spaced repetition flashcards.",
};

export default async function FlashcardsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const decks = await getDecksForUser(session.user.id!);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Premium Header */}
      <div className="bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-250/20 dark:border-amber-900/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <Sparkles className="h-24 w-24 text-amber-500" />
        </div>

        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100/50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 text-[10px] font-bold">
              Cognitive Science
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50">
            Spaced Repetition Decks
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
            Flashcards are scheduled for review based on how well you remember them using the SuperMemo-2 (SM-2) algorithm. Focus on card reviews to maximize retention.
          </p>
        </div>
      </div>

      <DeckList decks={decks} />
    </div>
  );
}

