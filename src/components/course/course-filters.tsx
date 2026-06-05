"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Star, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

interface CourseFiltersProps {
  categories: CategorySummary[];
}

export function CourseFilters({ categories }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentLevel = searchParams.get("level") || "all";
  const currentPrice = searchParams.get("price") || "all";
  const currentRating = searchParams.get("rating") || "all";
  const query = searchParams.get("q") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
  };

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];

  const prices = [
    { value: "all", label: "All Prices" },
    { value: "FREE", label: "Free Courses" },
    { value: "PAID", label: "Paid Courses" },
  ];

  const ratings = [
    { value: "all", label: "Any Rating" },
    { value: "4.5", label: "4.5 & up" },
    { value: "4.0", label: "4.0 & up" },
    { value: "3.5", label: "3.5 & up" },
  ];

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 shadow-sm rounded-2xl sticky top-20">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/60 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-extrabold flex items-center gap-1.5 text-neutral-850 dark:text-neutral-50 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-blue-500" /> Filters
        </CardTitle>
        <Button
          variant="ghost"
          size="xs"
          onClick={resetFilters}
          className="h-6 text-[10px] text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100"
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Categories</h4>
          <RadioGroup
            value={currentCategory}
            onValueChange={(val) => updateFilters("category", val)}
            className="space-y-1.5"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" className="h-3.5 w-3.5" />
              <Label htmlFor="cat-all" className="text-xs text-neutral-650 dark:text-neutral-350 cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.slug} id={`cat-${cat.id}`} className="h-3.5 w-3.5" />
                <Label htmlFor={`cat-${cat.id}`} className="text-xs text-neutral-650 dark:text-neutral-350 cursor-pointer">
                  {cat.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Course Level */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Difficulty Level</h4>
          <RadioGroup
            value={currentLevel}
            onValueChange={(val) => updateFilters("level", val)}
            className="space-y-1.5"
          >
            {levels.map((lvl) => (
              <div key={lvl.value} className="flex items-center space-x-2">
                <RadioGroupItem value={lvl.value} id={`lvl-${lvl.value}`} className="h-3.5 w-3.5" />
                <Label htmlFor={`lvl-${lvl.value}`} className="text-xs text-neutral-650 dark:text-neutral-350 cursor-pointer">
                  {lvl.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price</h4>
          <RadioGroup
            value={currentPrice}
            onValueChange={(val) => updateFilters("price", val)}
            className="space-y-1.5"
          >
            {prices.map((prc) => (
              <div key={prc.value} className="flex items-center space-x-2">
                <RadioGroupItem value={prc.value} id={`prc-${prc.value}`} className="h-3.5 w-3.5" />
                <Label htmlFor={`prc-${prc.value}`} className="text-xs text-neutral-650 dark:text-neutral-350 cursor-pointer">
                  {prc.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Ratings */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Rating</h4>
          <RadioGroup
            value={currentRating}
            onValueChange={(val) => updateFilters("rating", val)}
            className="space-y-1.5"
          >
            {ratings.map((rtg) => (
              <div key={rtg.value} className="flex items-center space-x-2">
                <RadioGroupItem value={rtg.value} id={`rtg-${rtg.value}`} className="h-3.5 w-3.5" />
                <Label htmlFor={`rtg-${rtg.value}`} className="text-xs text-neutral-650 dark:text-neutral-350 cursor-pointer flex items-center gap-1">
                  {rtg.label}
                  {rtg.value !== "all" && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
