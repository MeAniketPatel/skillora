"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeckSchema, addCardSchema } from "@/features/flashcards/contracts/flashcard.contract";
import { createDeckAction, addCardAction } from "@/actions/flashcard.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { toast } from "sonner";
import { BookOpen, Plus, Play, FolderPlus, HelpCircle } from "lucide-react";

interface Deck {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  _count: {
    flashcards: number;
  };
}

interface DeckListProps {
  decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const [isSubmittingDeck, setIsSubmittingDeck] = useState(false);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);

  const deckForm = useForm<z.infer<typeof createDeckSchema>>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const cardForm = useForm<z.infer<typeof addCardSchema>>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      front: "",
      back: "",
    },
  });

  const handleCreateDeck = async (values: z.infer<typeof createDeckSchema>) => {
    setIsSubmittingDeck(true);
    try {
      const res = await createDeckAction(values);
      if (!res.success) {
        toast.error(res.error || "Failed to create deck");
      } else {
        toast.success("Deck created successfully!");
        deckForm.reset();
        setCreateOpen(false);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingDeck(false);
    }
  };

  const handleAddCard = async (values: z.infer<typeof addCardSchema>) => {
    if (!selectedDeckId) return;
    setIsSubmittingCard(true);
    try {
      const res = await addCardAction(selectedDeckId, values);
      if (!res.success) {
        toast.error(res.error || "Failed to add card");
      } else {
        toast.success("Card added to deck!");
        cardForm.reset();
        setAddCardOpen(false);
        setSelectedDeckId(null);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">Create & Manage Decks</h3>
          <p className="text-[10px] text-neutral-450 mt-0.5">Use spaced repetition flashcards for efficient learning.</p>
        </div>

        {/* Create Deck Dialog Trigger */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl text-xs gap-1.5 font-bold">
              <FolderPlus className="h-4 w-4" /> Create Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">Create New Flashcard Deck</DialogTitle>
            </DialogHeader>
            <Form {...deckForm}>
              <form onSubmit={deckForm.handleSubmit(handleCreateDeck)} className="space-y-4 pt-2">
                <FormField
                  control={deckForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Next.js App Router Concepts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={deckForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Short summary of what is inside the deck" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-2">
                  <Button type="submit" disabled={isSubmittingDeck} className="w-full">
                    {isSubmittingDeck ? "Creating..." : "Create Deck"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
          <HelpCircle className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
          <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">No flashcard decks</h4>
          <p className="text-xs text-neutral-500 mt-1">Create your first deck to get started with spaced repetition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card
              key={deck.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{deck.title}</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-450 line-clamp-2 min-h-[32px] leading-relaxed">
                    {deck.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-450 font-semibold">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  <span>{deck._count.flashcards} Cards</span>
                </div>
              </CardContent>

              <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setAddCardOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 font-bold"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Card
                </Button>

                <Button
                  disabled={deck._count.flashcards === 0}
                  onClick={() => router.push(`/student/flashcards/${deck.id}`)}
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 font-bold"
                >
                  <Play className="h-3.5 w-3.5" /> Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Card Dialog */}
      <Dialog open={addCardOpen} onOpenChange={(open) => {
        setAddCardOpen(open);
        if (!open) setSelectedDeckId(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Add Card to Deck</DialogTitle>
          </DialogHeader>
          <Form {...cardForm}>
            <form onSubmit={cardForm.handleSubmit(handleAddCard)} className="space-y-4 pt-2">
              <FormField
                control={cardForm.control}
                name="front"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Front Side (Question / Concept)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. What is the difference between getServerSideProps and getStaticProps?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cardForm.control}
                name="back"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Back Side (Answer / Explanation)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Elaborate on the answer clearly" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={isSubmittingCard} className="w-full">
                  {isSubmittingCard ? "Adding..." : "Add Flashcard"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
