"use client";

import { useCartStore } from "@/features/cart";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ShoppingCart, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  shortDescription: string | null;
  price: number | null;
  level: string;
  duration: number | null; // minutes
  rating?: number;
  teacher: {
    name: string | null;
  };
  thumbnail?: string | null;
}

interface CourseComparisonProps {
  courses: Course[];
}

export function CourseComparison({ courses }: CourseComparisonProps) {
  const { addItem, items } = useCartStore();

  const handleAddToCart = (c: Course) => {
    addItem({
      id: c.id,
      title: c.title,
      price: c.price || 0,
      thumbnail: c.thumbnail,
      teacherName: c.teacher.name,
    });
    toast.success("Added to cart!");
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
        <p className="text-xs text-neutral-500 font-medium">Please select courses to compare side-by-side.</p>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
              <TableHead className="py-4 pl-6 text-neutral-500 text-xs font-bold w-48">Features</TableHead>
              {courses.map((c) => (
                <TableHead key={c.id} className="py-4 text-neutral-800 dark:text-neutral-100 text-xs font-extrabold text-center">
                  {c.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Thumbnail Row */}
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800/60">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Preview</TableCell>
              {courses.map((c) => (
                <TableCell key={c.id} className="py-4 text-center">
                  <div className="flex justify-center">
                    {c.thumbnail ? (
                      <div className="h-16 w-28 rounded-lg overflow-hidden border border-neutral-150 dark:border-neutral-800 shrink-0">
                        <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-28 bg-neutral-50 dark:bg-neutral-950 text-neutral-450 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>

            {/* Price Row */}
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800/60">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Price</TableCell>
              {courses.map((c) => (
                <TableCell key={c.id} className="py-4 text-center font-mono font-extrabold text-sm text-indigo-650 dark:text-indigo-400">
                  {c.price ? `$${c.price.toFixed(2)}` : "Free"}
                </TableCell>
              ))}
            </TableRow>

            {/* Level Row */}
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800/60">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Difficulty Level</TableCell>
              {courses.map((c) => (
                <TableCell key={c.id} className="py-4 text-center">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase">
                    {c.level}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>

            {/* Duration Row */}
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800/60">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Duration</TableCell>
              {courses.map((c) => (
                <TableCell key={c.id} className="py-4 text-center text-xs text-neutral-550 dark:text-neutral-400 font-medium">
                  {c.duration ? `${Math.round(c.duration / 60)} hours` : "Self-paced"}
                </TableCell>
              ))}
            </TableRow>

            {/* Teacher Row */}
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800/60">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Instructor</TableCell>
              {courses.map((c) => (
                <TableCell key={c.id} className="py-4 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {c.teacher.name || "Instructor"}
                </TableCell>
              ))}
            </TableRow>

            {/* Action Row */}
            <TableRow className="border-0">
              <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-500">Actions</TableCell>
              {courses.map((c) => {
                const inCart = items.some((item) => item.id === c.id);
                return (
                  <TableCell key={c.id} className="py-4 text-center">
                    <Button
                      disabled={inCart}
                      onClick={() => handleAddToCart(c)}
                      size="sm"
                      className="rounded-xl text-xs gap-1.5 font-bold"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {inCart ? "In Cart" : "Buy Now"}
                    </Button>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
