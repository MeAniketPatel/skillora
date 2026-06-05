"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAnnouncement } from "@/actions/announcement.actions";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Trash2, User, Calendar, Megaphone } from "lucide-react";

interface Announcement {
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

interface AnnouncementListProps {
  announcements: Announcement[];
  courseId: string;
}

export function AnnouncementList({ announcements, courseId }: AnnouncementListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    startTransition(async () => {
      const res = await deleteAnnouncement(id, courseId);
      if (!res.success) {
        alert(res.error || "Failed to delete announcement.");
      } else {
        router.refresh();
      }
    });
  };

  if (announcements.length === 0) {
    return (
      <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-8 text-center bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
          <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No announcements yet</p>
          <p className="text-xs text-neutral-400">
            Publish announcements to update your students on course events, exams, or resources.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card
          key={announcement.id}
          className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                    {announcement.user.name || "Instructor"}
                  </span>
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(announcement.createdAt).toLocaleDateString()}
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
  );
}
