// chat feature barrel

// Components
export { ChatSidebar } from "./components/chat-sidebar";
export { ChatWindow } from "./components/chat-window";

// Permissions
export { canChat as canChat, assertChatAccess } from "./permissions/chat.permissions";




// Contracts
export { createChatSchema, updateChatSchema, listChatQuerySchema } from "./contracts/chat.contract";
export type { CreateChatInput, UpdateChatInput } from "./contracts/chat.contract";
