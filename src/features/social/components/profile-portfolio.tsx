"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioProjectSchema } from "@/features/profile/contracts/profile.contract";
import { addPortfolioProjectAction, deletePortfolioProjectAction } from "@/actions/profile.actions";
import { ExternalLink, Trash2, FolderPlus, Loader2, Info } from "lucide-react";
import { z } from "zod";

type FormValues = z.infer<typeof portfolioProjectSchema>;

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  projectUrl: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

interface ProfilePortfolioProps {
  projects: PortfolioProject[];
  isOwnProfile: boolean;
}

export function ProfilePortfolio({ projects, isOwnProfile }: ProfilePortfolioProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(portfolioProjectSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      projectUrl: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const res = await addPortfolioProjectAction(data);
      if (!res.success) {
        setError(res.error || "Failed to add project.");
      } else {
        setShowAddForm(false);
        reset();
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project?")) return;
    startTransition(async () => {
      const res = await deletePortfolioProjectAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete project.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
          Showcase Projects
        </h2>
        {isOwnProfile && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-9 rounded-xl text-xs gap-1.5 font-bold"
          >
            <FolderPlus className="h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-4">Add Portfolio Project</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold">Project Title</Label>
                <Input id="title" placeholder="e.g. Skillora Platform Redesign" {...register("title")} className="h-10 rounded-xl" />
                {errors.title && <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold">Description</Label>
                <Textarea id="description" placeholder="Describe your project, technologies used, and outcomes..." rows={4} {...register("description")} className="rounded-xl resize-none text-xs" />
                {errors.description && <p className="text-[10px] text-red-500 font-medium">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectUrl" className="text-xs font-bold">Project Demo/GitHub URL</Label>
                  <Input id="projectUrl" placeholder="https://..." {...register("projectUrl")} className="h-10 rounded-xl text-xs" />
                  {errors.projectUrl && <p className="text-[10px] text-red-500 font-medium">{errors.projectUrl.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-xs font-bold">Project Screenshot Image URL</Label>
                  <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} className="h-10 rounded-xl text-xs" />
                  {errors.imageUrl && <p className="text-[10px] text-red-500 font-medium">{errors.imageUrl.message}</p>}
                </div>
              </div>

              {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="h-9 rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="h-9 rounded-xl text-xs gap-1.5 font-bold">
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-10 text-center bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
            <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <Info className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No projects added yet</p>
            <p className="text-xs text-neutral-400">
              {isOwnProfile ? "Showcase your practical learnings by uploading projects here." : "This user has not listed any showcase projects yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {project.imageUrl && (
                <div className="h-40 overflow-hidden relative">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">{project.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Demo
                    </a>
                  ) : (
                    <span className="text-[10px] text-neutral-400">No demo link</span>
                  )}

                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      disabled={isPending}
                      className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
