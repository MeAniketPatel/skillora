// chat feature barrel
export * from "./repositories";

// Components
export { ChatSidebar } from "./components/chat-sidebar";
export { ChatWindow } from "./components/chat-window";
// Permissions
export { canChat as canChat, assertChatAccess } from "./permissions/chat.permissions";
