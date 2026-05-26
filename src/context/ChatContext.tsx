// src/context/ChatContext.tsx
import { createContext, useContext, useState, useCallback } from "react";
import { fetchChatResponse } from "@/services/chatService";
import { mapApiToChatResponse } from "@/mappers/chatMapper";
import type { ChatResponse, WidgetData } from "@/types/chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  module?: string;
  widgets?: WidgetData[];
}

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  isExpanded: boolean;
  uploadExpect: string | null;
  setIsExpanded: (val: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: (val: boolean) => void;
  sendFileData: (
    fileName: string,
    fileType: string,
    data: unknown,
  ) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadExpect, setUploadExpect] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      setIsExpanded(true);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const apiRes = await fetchChatResponse(text);
        const formatted: ChatResponse = mapApiToChatResponse(apiRes);

        // ← set uploadExpect from API response
        setUploadExpect(formatted.uploadExpect ?? null);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: formatted.message,
            module: apiRes.module,
            widgets: formatted.widgets,
          },
        ]);
      } catch (err: unknown) {
        // ← reset uploadExpect on error
        setUploadExpect(null);

        let errorMessage = "Something went wrong. Please try again.";
        if (err instanceof Error) {
          if (err.message.includes("502") || err.message.includes("503")) {
            errorMessage =
              "The server is currently experiencing issues. Please try again in a moment.";
          } else if (
            err.message.includes("401") ||
            err.message.includes("403")
          ) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (err.message.includes("404")) {
            errorMessage = "The requested service could not be found.";
          } else if (err.message.includes("500")) {
            errorMessage =
              "An internal server error occurred. Please try again later.";
          } else if (
            err.message.includes("Failed to fetch") ||
            err.message.includes("NetworkError")
          ) {
            errorMessage =
              "Unable to connect. Please check your internet connection.";
          }
        }
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: errorMessage,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  const sendFileData = useCallback(
    async (fileName: string, fileType: string, data: unknown) => {
      setIsExpanded(true);

      // ← show friendly message in chat, not raw JSON
      const label = fileType === "cv" ? "CV" : "Job Description";
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: `${label} uploaded: ${fileName}`,
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const apiRes = await fetchChatResponse(
          `${label} uploaded: ${fileName}`,
          { type: fileType, data }, // ← file_data sent to API
        );
        const formatted: ChatResponse = mapApiToChatResponse(apiRes);
        setUploadExpect(formatted.uploadExpect ?? null);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: formatted.message,
            module: apiRes.module,
            widgets: formatted.widgets,
          },
        ]);
      } catch (err: unknown) {
        setUploadExpect(null);
        let errorMessage = "Something went wrong. Please try again.";
        if (err instanceof Error) {
          if (err.message.includes("502") || err.message.includes("503")) {
            errorMessage =
              "The server is currently experiencing issues. Please try again in a moment.";
          } else if (
            err.message.includes("401") ||
            err.message.includes("403")
          ) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (err.message.includes("500")) {
            errorMessage =
              "An internal server error occurred. Please try again later.";
          } else if (
            err.message.includes("Failed to fetch") ||
            err.message.includes("NetworkError")
          ) {
            errorMessage =
              "Unable to connect. Please check your internet connection.";
          }
        }
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: errorMessage,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        isExpanded,
        uploadExpect,
        setIsExpanded,
        sendMessage,
        sendFileData,
        setMessages,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
