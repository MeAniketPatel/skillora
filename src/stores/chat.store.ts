"use client";

import { create } from "zustand";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  senderImage?: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  participants: { id: string; name?: string; image?: string }[];
  lastMessage?: string;
  updatedAt: Date;
}

interface ChatStore {
  activeConversationId: string | null;
  conversations: Conversation[];
  messages: ChatMessage[];
  setActiveConversationId: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  conversations: [],
  messages: [],
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setConversations: (conversations) => set({ conversations }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
