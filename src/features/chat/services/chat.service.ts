// Stub service for the chat feature. This feature has no
// data-access layer of its own; it composes state from other features.

export const chatService = {} as const;

export type ChatService = typeof chatService;
