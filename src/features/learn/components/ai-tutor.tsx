"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Bot, User, Send, Loader2, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/shared/lib/utils";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface AITutorProps {
  courseTitle: string;
  lessonTitle: string;
}

const PRE_PROMPTS = [
  "Summarize this lesson",
  "Explain in simple terms",
  "Quiz me on this",
  "Give me a code example",
];

export function AITutor({ courseTitle, lessonTitle }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Hello! I am your Skillora AI Study Tutor. 📚\n\nI can help you review **${lessonTitle}** from the course **${courseTitle}**. Feel free to ask questions or choose one of the study aids below!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsgId = Date.now().toString();
    const botMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: textToSend },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          courseTitle,
          lessonTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentText = "";

      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: "bot", text: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // eslint-disable-next-line
          currentText = currentText + chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: currentText } : msg
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "Sorry, I ran into an error generating that response. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-12 gap-2 rounded-full bg-indigo-600 px-5 font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 animate-bounce"
      >
        <Bot className="h-5 w-5" />
        Ask AI Tutor
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[min(560px,calc(100vh-3rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-gradient-to-r from-indigo-50 to-white px-4 py-3 dark:border-neutral-800 dark:from-indigo-950/40 dark:to-neutral-950">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-50">
              Gemini Study Buddy
            </h3>
            <p className="truncate text-[10px] text-neutral-500 dark:text-neutral-400">
              {lessonTitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          aria-label="Minimize"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50/50 p-4 dark:bg-neutral-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-2.5",
              msg.sender === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                msg.sender === "user"
                  ? "border-neutral-300 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  : "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400",
              )}
            >
              {msg.sender === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>

            <div
              className={cn(
                "flex max-w-[78%] flex-col",
                msg.sender === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "rounded-2xl px-3 py-2 text-xs leading-relaxed break-words",
                  msg.sender === "user"
                    ? "rounded-tr-sm bg-indigo-600 text-white"
                    : "rounded-tl-sm border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
                )}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-p:my-1 prose-p:leading-relaxed prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-1 prose-headings:text-xs prose-headings:font-bold prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[11px] prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-neutral-800 prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-strong:text-neutral-900 dark:prose-strong:text-neutral-50 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text || "▍"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && messages[messages.length - 1]?.sender === "user" && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Pre-prompts */}
      {messages.length <= 1 && !isTyping && (
        <div className="flex flex-wrap gap-1.5 border-t border-neutral-200 bg-white px-3 pb-2 pt-3 dark:border-neutral-800 dark:bg-neutral-950">
          {PRE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={isTyping}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-medium text-neutral-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 border-t border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI study question..."
          disabled={isTyping}
          className="h-10 flex-1 rounded-xl border-neutral-200 bg-neutral-50 text-xs dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-500"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isTyping || !input.trim()}
          className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
