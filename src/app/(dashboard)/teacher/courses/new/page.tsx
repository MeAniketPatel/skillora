"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { courseCreateSchema, CourseCreateInput } from "@/validations/course.schema";
import { createCourse } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  const form = useForm<CourseCreateInput>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      level: "BEGINNER",
    },
  });

  useEffect(() => {
    // Ideally fetch from a server action here or API
    fetch("/api/categories").then(res => res.json()).then(data => {
      setCategories(data || []);
    }).catch(() => {
      // Mock categories for now if API isn't setup
      setCategories([
        { id: "cm5e1a1230000abc", name: "Development" },
        { id: "cm5e1b1230000def", name: "Design" },
      ]);
    });
  }, []);

  const onSubmit = async (values: CourseCreateInput) => {
    try {
      const res = await createCourse(values);
      if (res && res.error) {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      } else if (res && res.success && res.data) {
        toast({ title: "Success", description: "Course created!" });
        router.push(`/teacher/courses/${res.data.id}`);
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 mt-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a new course</h1>
        <p className="text-muted-foreground">What would you like to teach? You can always change this later.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input disabled={form.formState.isSubmitting} placeholder="e.g. 'Advanced Web Development'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                    <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
