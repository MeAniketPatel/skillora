"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface AddSectionFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function AddSectionForm({
  value,
  onChange,
  onSubmit,
  isPending,
}: AddSectionFormProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader>
        <CardTitle>Add Section</CardTitle>
        <CardDescription>
          Create a new container section for lessons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="secTitle">Section Title</Label>
          <Input
            id="secTitle"
            placeholder="e.g. 'Introduction to React'"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isPending}
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="w-full"
        >
          Create Section
        </Button>
      </CardContent>
    </Card>
  );
}

export function AddLessonForm({
  value,
  onChange,
  onSubmit,
  isPending,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Input
        placeholder="New lesson title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
        disabled={isPending}
      />
      <Button size="sm" onClick={onSubmit} disabled={isPending}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}
