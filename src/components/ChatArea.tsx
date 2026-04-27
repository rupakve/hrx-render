import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Menu } from "lucide-react";
import type { ChatResponse } from "@/types/chat";
import { fetchChatResponse } from "@/services/chatService";
import { mapApiToChatResponse } from "@/mappers/chatMapper";
/* import WidgetCard from "@/components/common/WidgetCard"; */

import WidgetCard from "@/components/common/widgets/WidgetCard";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  response?: ChatResponse;
}

const SUGGESTIONS = [
  "Show my leave balance",
  "Any open IT tickets?",
  "Download my payslip",
  "Show my goals",
];

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onMenuClick?: () => void;
}

const ChatArea = ({ messages, setMessages, onMenuClick }: ChatAreaProps) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiRes = await fetchChatResponse(query);
      const formatted = mapApiToChatResponse(apiRes);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: formatted.message,
        response: formatted,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: errorMessage,
        response: { message: "", widgets: [] },
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderText = (text: string) => {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center px-4 md:px-6 bg-card shadow-chat gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <Menu size={20} className="text-foreground" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-sm text-foreground">
              AssistBot
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Connected to HRX, ITSM, Cerework
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot size={28} className="text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              How can I help you today?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              Ask me about your leave balance, IT tickets, workspace bookings,
              payslips, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-4 py-2 text-sm bg-card border border-border rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-slide-up">
              {msg.role === "user" ? (
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-md">
                    {msg.text}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User size={14} className="text-secondary-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                      {renderText(msg.text)}
                    </p>
                    {msg.response?.widgets &&
                      msg.response.widgets.length > 0 && (
                        <div className="space-y-3">
                          {msg.response.widgets.map((widget, i) => (
                            <WidgetCard key={i} data={widget} />
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-center bg-background border border-border rounded-xl px-4 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about leave, tickets, goals..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1.5"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 disabled:opacity-30 transition-all shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            AssistBot connects to HRX, ITSM & Cerework. Responses are simulated
            for demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
