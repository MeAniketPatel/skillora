"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendStudyGroupMessageAction } from "@/actions/study-group.actions";
import { Send, User, Calendar, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface GroupChatProps {
  groupId: string;
  groupName: string;
  initialMessages: Message[];
  currentUserId: string;
  members: { userId: string; user: { name: string | null; image: string | null } }[];
}

export function GroupChat({ groupId, groupName, initialMessages, currentUserId, members }: GroupChatProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const memberMap = new Map(
    members.map((m) => [m.userId, { name: m.user.name || "User", image: m.user.image }])
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [initialMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;

    startTransition(async () => {
      const res = await sendStudyGroupMessageAction(groupId, { content: text });
      if (!res.success) {
        alert(res.error || "Failed to send message.");
      } else {
        setText("");
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            #{groupName} Discussion Channel
          </h3>
          <span className="text-[10px] text-neutral-400">{members.length} members online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {initialMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-neutral-400 italic">
            No messages sent yet. Start the conversation!
          </div>
        ) : (
          initialMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const sender = memberMap.get(msg.senderId) || { name: "System User", image: null };

            return (
              <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <img
                  src={sender.image || "/placeholder-avatar.png"}
                  alt={sender.name}
                  className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5"
                  onError={(e) => {
                    e.currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
                <div className={`flex flex-col space-y-0.5 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-neutral-400 font-bold">{sender.name}</span>
                  <div className={`p-2.5 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-850 dark:text-neutral-50 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-neutral-400 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message study group..."
          disabled={isPending}
          className="h-10 rounded-xl text-xs flex-1"
        />
        <Button type="submit" size="icon" disabled={isPending || !text.trim()} className="h-10 w-10 rounded-xl shrink-0">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Card>
  );
}
