import { getDeckDetails } from "@/features/flashcards/server";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { FlashcardReviewer } from "@/features/flashcards/server";

interface DeckReviewPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export async function generateMetadata({ params }: DeckReviewPageProps) {
  const { deckId } = await params;
  const deck = await getDeckDetails(deckId);
  return {
    title: `Reviewing: ${deck?.title || "Deck"} | Skillora`,
  };
}

export default async function DeckReviewPage({ params }: DeckReviewPageProps) {
  const { deckId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const deck = await getDeckDetails(deckId);
  if (!deck) {
    notFound();
  }

  return (
    <div className="py-6">
      <FlashcardReviewer deckTitle={deck.title} flashcards={deck.flashcards} />
    </div>
  );
}

