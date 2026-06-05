"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { sendMessageAction } from "@/features/messages";
import { Send, User, Loader2, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ChatWindowProps {
  conversationId: string;
  partnerName: string;
  partnerImage: string | null;
  initialMessages: Message[];
  currentUserId: string;
}

export function ChatWindow({ conversationId, partnerName, partnerImage, initialMessages, currentUserId }: ChatWindowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [initialMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;

    startTransition(async () => {
      const res = await sendMessageAction(conversationId, { content: text });
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
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={partnerImage || ""} />
          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
            <User className="h-4 w-4 text-neutral-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">{partnerName}</h3>
          <span className="text-[9px] text-green-500 font-bold">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {initialMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Start the conversation</p>
            <p className="text-[10px] text-neutral-400">Say hello to {partnerName}! Keep in mind platform rules apply.</p>
          </div>
        ) : (
          initialMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;

            return (
              <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={isMe ? "" : partnerImage || ""} />
                  <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
                    <User className="h-3 w-3 text-neutral-400" />
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col space-y-0.5 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
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
          placeholder={`Type message to ${partnerName}...`}
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
