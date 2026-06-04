export interface MessageParticipant {
  id: string;
  name: string | null;
  image: string | null;
}

export interface ChatConversation {
  id: string;
  participants: MessageParticipant[];
  messages: ChatMessage[];
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: MessageParticipant;
}
