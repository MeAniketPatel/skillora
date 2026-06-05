"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, ExternalLink, MailOpen } from "lucide-react";
import Link from "next/link";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/features/notifications/actions/notification.actions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id: string) => {
    const prev = notifications;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    const res = await markNotificationAsRead(id);
    if (!res.success) {
      setNotifications(prev);
    }
  };

  const handleReadAll = async () => {
    const prev = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    const res = await markAllNotificationsAsRead();
    if (!res.success) {
      setNotifications(prev);
    }
  };

  function formatTimeAgo(dateInput: Date | string) {
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-2 ring-white dark:ring-neutral-950 animate-pulse" />
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 md:left-0 md:right-auto md:bottom-full md:top-auto md:mb-2 z-50 w-80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl animate-in fade-in-50 slide-in-from-top-1 md:slide-in-from-bottom-1 duration-150 py-0 gap-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
              <div>
                <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Notifications</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {unreadCount} unread messages
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAll}
                  className="h-7 text-xs font-semibold px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                >
                  Mark all read
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 max-h-80 overflow-y-auto py-0">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-xs text-neutral-400">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
                  <MailOpen className="h-8 w-8 mb-2 opacity-50 text-neutral-300 dark:text-neutral-700" />
                  <span className="text-xs">No notifications yet</span>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col p-4 text-left transition-colors relative ${
                        !item.isRead ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {!item.isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                          {!item.isRead && (
                            <button
                              onClick={() => handleRead(item.id)}
                              className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-normal">
                        {item.message}
                      </p>
                      {item.link && (
                        <Link
                          href={item.link}
                          onClick={() => {
                            handleRead(item.id);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-2 hover:underline"
                        >
                          View Details <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
