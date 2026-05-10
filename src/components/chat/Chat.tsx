"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { chatAssistant, generateArticle, generateRecommendations } from "@/actions/ai.actions";
import { toast } from "react-toastify";

type Message = {
  title?: string;
  description?: string;
  role?: string;
  answer?:string
};

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
}

export default function ChatPage() {
  const chatTypes = [
    { label: "Article", value: "article" },
    { label: "Assistant", value: "assistand" }
  ];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("article");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Clear all chat messages
  const clearChat = () => setMessages([]);

  // Handles sending a message
  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      let res: any;
      if (activeType === "article") {
        res = await generateArticle({ prompt: input });
      } else if (activeType === "recommandations") {
        res = await generateRecommendations({ prompt: input });
      }
      else if (activeType === "assistand") {
        res = await chatAssistant({ prompt: input });
      }
      else {
        setLoading(false);
        setInput("");
        toast.error("Type 'assistand' not implemented yet.");
        return;
      }

      if (!res || !res.success) {
        let errorMsg = "An error occurred. Please try again.";
        if (res && res.message) errorMsg = res.message;
        toast.error(errorMsg);
      } else {
        setMessages(res.data as Message[]);
      }
    } catch (error: any) {
      let errorMsg = "An unexpected error occurred.";
      if (error && error.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Handle Enter key
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      send();
    }
  };

  return (
    <main className="py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <section className="flex flex-col w-full max-w-xl h-[72vh] rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300">
          {/* Header */}
          <header className="sticky top-0 z-10 flex flex-col gap-4 bg-white/95 dark:bg-zinc-950/85 border-b border-zinc-100 dark:border-zinc-800 rounded-t-2xl backdrop-blur-sm px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 select-none">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-500 shadow-lg">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="text-white"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </span>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100" style={{fontFamily: "Inter, Geist, Plus Jakarta Sans, Satoshi, sans-serif"}}>
                  AI Chat
                </h1>
              </div>
              <Button
                onClick={clearChat}
                variant="outline"
                className="rounded-2xl border border-zinc-300 bg-white px-5 py-2.5 text-base font-medium text-red-600 hover:bg-red-100 transition-all shadow-sm active:scale-95 dark:border-zinc-700 dark:bg-zinc-900"
                aria-label="Clear chat history"
                type="button"
                disabled={messages.length === 0 && !loading}
              >
                Clear Chat
              </Button>
            </div>
            {/* Chat Type Tabs */}
            <nav className="flex gap-2 mt-1">
              {chatTypes.map(({ label, value }) => (
                <Button
                  key={value}
                  onClick={() => setActiveType(value)}
                  variant="ghost"
                  className={`rounded-xl transition-all text-base font-semibold px-4 py-1.5 ${
                    activeType === value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  aria-pressed={activeType === value}
                >
                  {label}
                </Button>
              ))}
            </nav>
          </header>

          {/* Chat Body */}
          <section
            ref={chatBodyRef}
            className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-5 bg-zinc-50 dark:bg-zinc-900/90 rounded-b-none transition-all duration-200"
            aria-live="polite"
          >
            {messages.length === 0 && !loading && (
              <div className="flex justify-center items-center h-full">
                <span className="text-base text-zinc-500 dark:text-zinc-400 select-none">
                  No messages yet. Start chatting!
                </span>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex group mb-1 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    message.role === "user"
                      ? "relative ml-auto max-w-[78%] rounded-2xl bg-indigo-600 px-5 py-3 text-white shadow transition-all duration-200"
                      : "relative max-w-[78%] rounded-2xl bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 px-5 py-3 text-zinc-900 dark:text-zinc-100 shadow transition-all duration-200"
                  }
                >
                  <p className="whitespace-pre-line break-words text-base leading-6 mb-1 font-medium text-zinc-100/95 dark:text-zinc-100">
                    {message.title??""}
                  </p>
                  <p className="whitespace-pre-line break-words text-base leading-6 mb-1 font-medium text-zinc-100/95 dark:text-zinc-100">
                    {message.answer??""}
                  </p>
                  <span className={message.role === "user" ? "text-white" : "text-zinc-700 dark:text-zinc-300"}>
                    {message.description??""}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 mt-2 animate-pulse">
                <span className="text-indigo-500">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      className="opacity-30"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="currentColor"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-base text-indigo-600 dark:text-indigo-400 font-medium select-none">
                  AI is typing…
                </span>
              </div>
            )}
          </section>

          {/* Input */}
          <form
            className="flex gap-3 items-end border-t border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/70 rounded-b-2xl px-8 py-4"
            onSubmit={e => {
              e.preventDefault();
              if (!loading) send();
            }}
            autoComplete="off"
            aria-label="Send message"
          >
            <input
              type="text"
              placeholder="Type your message and hit Enter…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-base text-zinc-900 dark:text-zinc-100 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-60"
              aria-label="Message input"
              autoFocus
              style={{fontFamily: "Inter, Geist, Plus Jakarta Sans, Satoshi, sans-serif"}}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:opacity-60"
              aria-label="Send message"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}