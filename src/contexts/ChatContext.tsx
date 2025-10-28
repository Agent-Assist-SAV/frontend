/**
 * Dev-only hook to get the current chat context from the application.
 * This is used by the ClientSimulator to auto-populate the chat ID.
 */
import { useContext, createContext } from "react";

interface ChatContextType {
  currentChatId?: string;
}

export const ChatContext = createContext<ChatContextType>({});

export function useChatContext() {
  const context = useContext(ChatContext);
  return context;
}
