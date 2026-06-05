"use client";

import { create } from "zustand";

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;
  incrementUnread: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
