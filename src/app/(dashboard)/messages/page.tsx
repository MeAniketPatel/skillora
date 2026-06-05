import React from "react";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getConversations, getMessages } from "@/features/social";
import { PageHeader } from "@/shared/components/shared/page-header";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { Card } from "@/shared/components/ui/card";

interface MessagesPageProps {
  searchParams: Promise<{
    activeChat?: string;
  }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const user = await requireAuth();
  const { activeChat } = await searchParams;

  const conversations = await getConversations(user.id!);

  let activeConvDetails = null;
  let partner = null;
  let messages: any[] = [];

  if (activeChat) {
    const conv = conversations.find((c) => c.id === activeChat);
    if (conv) {
      activeConvDetails = conv;
      partner = conv.participants.find((p) => p.userId !== user.id) || conv.participants[0];
      messages = await getMessages(activeChat);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Direct Conversations"
        description="Connect and share code samples, debug problems, and coordinate assignments with other members."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <ChatSidebar
            conversations={conversations as any}
            activeConversationId={activeChat}
            currentUserId={user.id!}
          />
        </div>

        <div className="md:col-span-2">
          {activeConvDetails && partner ? (
            <ChatWindow
              conversationId={activeConvDetails.id}
              partnerName={partner.user.name || "User"}
              partnerImage={partner.user.image}
              initialMessages={messages}
              currentUserId={user.id!}
            />
          ) : (
            <Card className="bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 text-center h-[500px] flex items-center justify-center">
              <p className="text-xs text-neutral-450 italic max-w-[200px]">
                Select a conversation from the sidebar, or navigate to a member&apos;s profile to start a new chat.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
