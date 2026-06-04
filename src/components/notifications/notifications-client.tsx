"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Award,
  FileText,
  DollarSign,
  CheckCircle,
  Inbox,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notification.actions";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
}

export function NotificationsClient({
  initialNotifications,
}: NotificationsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const notifications = initialNotifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setActiveId(id);
    startTransition(async () => {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        router.refresh();
      }
      setActiveId(null);
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        router.refresh();
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ENROLLMENT":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "CERTIFICATE":
        return <Award className="h-4 w-4 text-purple-500" />;
      case "ASSIGNMENT_SUBMISSION":
      case "ASSIGNMENT_GRADED":
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case "PAYMENT_RECEIVED":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-neutral-400" />;
    }
  };

  const hasUnread = initialNotifications.some((n) => !n.isRead);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
        {/* Toggle Filters */}
        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl w-full sm:w-auto">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1 sm:flex-none text-xs rounded-lg h-8"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1 sm:flex-none text-xs rounded-lg h-8"
          >
            Unread
          </Button>
        </div>

        {/* Mark All As Read */}
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleMarkAllAsRead}
            className="text-xs rounded-xl h-9 w-full sm:w-auto"
          >
            {isPending && !activeId && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
          <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
            <Inbox className="h-7 w-7 text-neutral-400" />
          </div>
          <CardTitle className="text-xl font-bold">
            No notifications found
          </CardTitle>
          <CardDescription className="max-w-sm mt-2 text-sm text-neutral-500">
            {filter === "unread"
              ? "All caught up! You don't have any unread notifications."
              : "You haven't received any notifications yet."}
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                "overflow-hidden bg-white dark:bg-neutral-900 border transition-all duration-200 rounded-2xl shadow-sm",
                n.isRead
                  ? "border-neutral-200/40 dark:border-neutral-800/40 opacity-75"
                  : "border-neutral-200 dark:border-neutral-800 shadow-md ring-1 ring-primary/5"
              )}
            >
              <CardContent className="p-5 flex gap-4 items-start justify-between">
                <div className="flex gap-4 items-start min-w-0 flex-1">
                  {/* Icon Wrapper */}
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center border shrink-0",
                      n.isRead
                        ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-100 dark:border-neutral-850"
                        : "bg-primary/5 border-primary/10"
                    )}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Message details */}
                  <div className="space-y-1 min-w-0 flex-1 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h4 className="font-bold text-neutral-850 dark:text-neutral-50">
                        {n.title}
                      </h4>
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
                        {new Date(n.createdAt).toLocaleDateString()} at{" "}
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {n.link && (
                    <a
                      href={n.link}
                      className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[11px] font-semibold text-neutral-750 dark:text-neutral-250 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors gap-1 h-8"
                      )}
                    >
                      Go <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] h-8 rounded-xl px-3"
                    >
                      {isPending && activeId === n.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Mark as read"
                      )}
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
