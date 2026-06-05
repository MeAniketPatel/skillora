// chat feature barrel
export * from "./repositories";

// Components
export { ChatSidebar } from "./components/chat-sidebar";
export { ChatWindow } from "./components/chat-window";
// Permissions
export { canChat as canChat, assertChatAccess } from "./permissions/chat.permissions";

// Contracts
export { createChatSchema, updateChatSchema, listChatQuerySchema } from "./contracts/chat.contract";
export type { CreateChatInput, UpdateChatInput, ListChatQuery } from "./contracts/chat.contract";

// Hooks
export {  useChatList, useChatDetail, useChatCreate, useChatUpdate, useChatDelete } from "./hooks/use-chat";


// Services
export { chatService } from "./services/chat.service";
export type { ChatService } from "./services/chat.service";
