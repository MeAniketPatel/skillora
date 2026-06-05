"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Bot, User, Send, Loader2, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

      // Read stream chunks
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let botResponseText = "";

      // Add placeholder bot message
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: "bot", text: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          botResponseText += chunk;

          // Update the specific bot message content in real time
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: botResponseText } : msg
            )
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "bot", text: "Sorry, I ran into an error generating that response. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 h-12 rounded-full shadow-lg font-bold gap-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white z-50 animate-bounce"
      >
        <Bot className="h-5 w-5" />
        Ask AI Tutor
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-neutral-850 dark:text-neutral-50">Gemini Study Buddy</h3>
            <span className="text-[9px] text-neutral-400">Context: {lessonTitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 items-start ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center border text-neutral-400 shrink-0 ${
              msg.sender === "user"
                ? "bg-neutral-50 border-neutral-100 dark:bg-neutral-850 dark:border-neutral-800"
                : "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30 text-indigo-500"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`flex flex-col max-w-[75%] space-y-1`}>
              <div className={`p-2.5 rounded-2xl text-xs leading-relaxed prose prose-neutral dark:prose-invert ${
                msg.sender === "user"
                  ? "bg-indigo-650 text-white rounded-tr-none"
                  : "bg-neutral-50 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-100 dark:border-neutral-800/40"
              }`}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5 items-center">
            <div className="h-7 w-7 rounded-full bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <span className="text-[10px] text-neutral-400">AI is compiling thoughts...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 justify-center">
          {PRE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={isTyping}
              className="text-[10px] px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-850 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-800/50 rounded-full font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50/30 dark:bg-neutral-900 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI study question..."
          disabled={isTyping}
          className="h-10 rounded-xl text-xs flex-1"
        />
        <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="h-10 w-10 rounded-xl shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
