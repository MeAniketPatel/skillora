"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User, CheckCheck, Clock } from "lucide-react";

interface Participant {
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

interface Message {
  content: string;
  createdAt: Date;
  senderId: string;
}

interface Conversation {
  id: string;
  participants: Participant[];
  messages: Message[];
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  currentUserId: string;
}

export function ChatSidebar({ conversations, activeConversationId, currentUserId }: ChatSidebarProps) {
  const router = useRouter();

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
        <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-indigo-500" />
          Direct Messages
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/50">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-450 italic">
            No active conversations. Start one from a user profile!
          </div>
        ) : (
          conversations.map((c) => {
            const partner = c.participants.find((p) => p.userId !== currentUserId) || c.participants[0];
            const latestMsg = c.messages[0];
            const isActive = c.id === activeConversationId;

            return (
              <div
                key={c.id}
                onClick={() => router.push(`/messages?activeChat=${c.id}`)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors ${
                  isActive ? "bg-indigo-50/40 dark:bg-indigo-950/10 border-r-2 border-indigo-500" : ""
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={partner.user.image || ""} />
                  <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
                    <User className="h-4 w-4 text-neutral-400" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-xs font-bold text-neutral-850 dark:text-neutral-50 truncate">
                      {partner.user.name || "User"}
                    </span>
                    {latestMsg && (
                      <span className="text-[9px] text-neutral-400 font-medium shrink-0 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(latestMsg.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 leading-relaxed">
                    {latestMsg ? latestMsg.content : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
