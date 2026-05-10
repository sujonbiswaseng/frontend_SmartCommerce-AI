// ==========================================
// hooks/use-ai-chat.ts
// ==========================================

"use client";

import { generateArticle } from "@/actions/ai.actions";
import { useState } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response =await generateArticle(prompt)
      console.log(response,'response')

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REMOVE CHAT
  // ==========================================

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  };
};