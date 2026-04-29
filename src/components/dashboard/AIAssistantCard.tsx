//components/dashboard/AIAssistantCard.tsx
import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, User } from "lucide-react";
import { fetchChatResponse } from "@/services/chatService";
import { mapApiToChatResponse } from "@/mappers/chatMapper";
import type { ChatResponse, WidgetData } from "@/types/chat";
import WidgetCard from "@/components/common/widgets/WidgetCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  module?: string;
  widgets?: WidgetData[];
}

const CHIPS = [
  //"Show my leave balance",
  //"Check IT tickets",
  //"Show me my Goals",
  //"My pending approvals",
];

const moduleBadge: Record<string, { label: string; color: string }> = {
  hrx: {
    label: "HRX",
    color: "bg-widget-hrx/15 text-widget-hrx border border-widget-hrx/30",
  },
  usms: {
    label: "USMS",
    color: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },
  cerework: {
    label: "Cerework",
    color:
      "bg-widget-cerework/15 text-widget-cerework border border-widget-cerework/30",
  },
  crm: {
    label: "CRM",
    color: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  },
};

const AIAssistantCard = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleGenerate = async (overrideQuery?: string) => {
    const text = (overrideQuery ?? query).trim();
    if (!text || loading) return;

    if (!isExpanded) setIsExpanded(true);

    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const apiRes = await fetchChatResponse(text);
      const formatted: ChatResponse = mapApiToChatResponse(apiRes);
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
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof Error) {
        if (err.message.includes("502") || err.message.includes("503")) {
          errorMessage =
            "The server is currently experiencing issues. Please try again in a moment.";
        } else if (err.message.includes("401") || err.message.includes("403")) {
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
  };

  const showChips = messages.length === 0 && !isExpanded;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_30%_6%)] shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-primary/5 blur-2xl opacity-30 pointer-events-none" />

      {/* ── Chat history ── */}
      {isExpanded && (
        <>
          <div
            ref={chatContainerRef}
            className="relative flex flex-col px-5 pt-5 pb-3 max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const isFirstInGroup =
                idx === 0 || messages[idx - 1].role !== msg.role;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} ${
                    isFirstInGroup ? "mt-5 first:mt-0" : "mt-1.5"
                  }`}
                >
                  {/* Avatar — only on first bubble of a group */}
                  <div className="w-7 shrink-0">
                    {isFirstInGroup ? (
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isUser
                            ? "bg-white/8 border border-white/10"
                            : "bg-primary shadow-[0_0_18px_hsl(160_62%_48%/0.55)] border border-primary/50"
                        }`}
                      >
                        {isUser ? (
                          <User size={13} className="text-white/50" />
                        ) : (
                          <Sparkles
                            size={12}
                            className="text-primary-foreground"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-7" />
                    )}
                  </div>

                  {/* Content column */}
                  <div
                    className={`flex flex-col gap-2 min-w-0 ${
                      isUser
                        ? "items-end max-w-[80%]"
                        : msg.widgets && msg.widgets.length > 0
                          ? "items-start w-full" // ← full width when widgets present
                          : "items-start max-w-[80%]" // ← normal width for text only
                    }`}
                  >
                    {isFirstInGroup && (
                      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 px-0.5">
                        {isUser ? "You" : "AI Assistant"}
                      </span>
                    )}

                    {/* Module badge — only on assistant messages */}
                    {!isUser && msg.module && moduleBadge[msg.module] && (
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${moduleBadge[msg.module].color}`}
                      >
                        {moduleBadge[msg.module].label}
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className={`px-4 py-2.5 text-sm leading-[1.65] ${
                        isUser
                          ? "bg-primary/20 border border-primary/35 text-white rounded-2xl rounded-tr-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "bg-white/[0.05] border border-white/[0.07] text-white/80 rounded-2xl rounded-tl-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                      }`}
                    >
                      {/* Message text */}
                      {msg.text.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {/* Widgets — scrollable row */}
                    {!isUser && msg.widgets && msg.widgets.length > 0 && (
                      <div className="w-full mt-1">
                        {msg.widgets.map((widget, i) => (
                          <div key={i} className="w-full">
                            <WidgetCard
                              data={widget}
                              onSelect={(value) => handleGenerate(value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 mt-5">
                <div className="w-7 h-7 rounded-full bg-primary shadow-[0_0_18px_hsl(160_62%_48%/0.55)] border border-primary/50 flex items-center justify-center shrink-0">
                  <Sparkles size={12} className="text-primary-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 px-0.5">
                    AI Assistant
                  </span>
                  <div className="bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-tl-sm px-5 py-3.5 flex gap-2 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="h-2" />
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </>
      )}

      {/* ── Input row ── */}
      <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 md:p-5">
        <div className="flex items-start gap-3 flex-1 w-full">
          {!isExpanded && (
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_hsl(160_62%_48%/0.4)] shrink-0">
              <Sparkles size={20} className="text-primary-foreground" />
            </div>
          )}

          <div className="flex-1 w-full">
            {!isExpanded && (
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                AI Assistant
              </p>
            )}

            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder={
                isExpanded
                  ? "Ask a follow-up..."
                  : "Ask anything about HR, IT, or workspace..."
              }
              rows={1}
              className="w-full bg-transparent text-lg md:text-2xl text-white placeholder:text-white/40 outline-none resize-none overflow-hidden font-light leading-relaxed"
            />

            {showChips && (
              <div className="flex flex-wrap gap-2 mt-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleGenerate(chip)}
                    className="text-xs text-primary/70 border border-primary/20 bg-primary/5 rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {!query && !isExpanded && (
              <p className="text-xs text-white/20 mt-1">
                {/* Try: "Show my leave balance" or "Check IT tickets" */}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={!query.trim() || loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all
          hover:scale-[1.02] hover:shadow-[0_0_20px_hsl(160_62%_48%/0.5)]
          disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? "Generating..." : isExpanded ? "Send" : "Generate"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantCard;
