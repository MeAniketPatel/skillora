"use client";

import { useTransition, useState } from "react";
import { useAnnouncements } from "@/features/announcements/hooks/use-announcements";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/features/announcements/contracts/announcement.contract";
import { createGlobalAnnouncement, deleteGlobalAnnouncement } from "@/actions/announcement.actions";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Trash2, User, Calendar, Megaphone, Loader2 } from "lucide-react";
import { z } from "zod";

type FormValues = z.infer<typeof announcementSchema>;

interface GlobalAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface PlatformAnnouncementsProps {
  initialAnnouncements: GlobalAnnouncement[];
}

export function PlatformAnnouncements({ initialAnnouncements }: PlatformAnnouncementsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await createGlobalAnnouncement(data);
      if (!res.success) {
        setError(res.error || "Failed to publish global announcement.");
      } else {
        setSuccess("Global announcement published successfully!");
        reset();
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this global announcement? It will be removed from all user dashboards.")) return;

    startTransition(async () => {
      const res = await deleteGlobalAnnouncement(id);
      if (!res.success) {
        alert(res.error || "Failed to delete announcement.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {/* Create Form */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm md:col-span-1">
        <CardContent className="p-6">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-4">
            Broadcast New Announcement
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold">Subject / Title</Label>
              <Input
                id="title"
                placeholder="e.g., Scheduled Maintenance Next Sunday"
                {...register("title")}
                disabled={isPending}
                className="h-10 rounded-xl"
              />
              {errors.title && (
                <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs font-bold">Details</Label>
              <Textarea
                id="content"
                placeholder="Write the full broadcast content..."
                rows={5}
                {...register("content")}
                disabled={isPending}
                className="rounded-xl resize-none text-xs"
              />
              {errors.content && (
                <p className="text-[10px] text-red-500 font-medium">{errors.content.message}</p>
              )}
            </div>

            {error && (
              <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p className="text-[11px] font-semibold text-green-500 bg-green-50 dark:bg-green-950/30 p-2.5 rounded-lg">
                {success}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="w-full h-10 rounded-xl text-xs gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish Broadcast
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">
          Global Broadcast Log
        </h2>

        {initialAnnouncements.length === 0 ? (
          <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-8 text-center bg-white dark:bg-neutral-900 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
              <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No broadcasts yet</p>
              <p className="text-xs text-neutral-400">
                Any global announcements published will be displayed here for auditing.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {initialAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={announcement.user.image || ""} />
                        <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
                          <User className="h-4 w-4 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-850 dark:text-neutral-50">
                          {announcement.user.name || "Administrator"}
                        </span>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(announcement.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(announcement.id)}
                      disabled={isPending}
                      className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 whitespace-pre-wrap leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
