"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, ExternalLink, MailOpen } from "lucide-react";
import Link from "next/link";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notification.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.notifications) {
        setNotifications(res.notifications);
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
    if (res.error) {
      setNotifications(prev);
    }
  };

  const handleReadAll = async () => {
    const prev = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    const res = await markAllNotificationsAsRead();
    if (res.error) {
      setNotifications(prev);
    }
  };

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
          <Card className="absolute right-0 top-12 z-50 w-80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl animate-in fade-in-50 slide-in-from-top-1 duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-bold">Notifications</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {unreadCount} unread messages
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAll}
                  className="h-7 text-xs font-semibold px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Mark all read
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-xs text-neutral-400">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
                  <MailOpen className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs">No notifications yet</span>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col p-4 text-left transition-colors relative ${
                        !item.isRead ? "bg-indigo-50/20 dark:bg-indigo-950/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {item.title}
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
                      <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
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
