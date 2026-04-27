import { MessageSquare, Plus, Clock, X } from "lucide-react";

interface ChatHistory {
  id: string;
  title: string;
  time: string;
}

const history: ChatHistory[] = [
  { id: "1", title: "Leave balance query", time: "2m ago" },
  { id: "2", title: "VPN issue ticket", time: "1h ago" },
  { id: "3", title: "Desk booking for tomorrow", time: "3h ago" },
  { id: "4", title: "Payslip download", time: "Yesterday" },
];

interface ChatSidebarProps {
  onNewChat: () => void;
  onClose: () => void;
}

const ChatSidebar = ({ onNewChat, onClose }: ChatSidebarProps) => {
  return (
    <aside className="w-72 bg-chat-sidebar text-chat-sidebar-foreground flex flex-col h-full">
      <div className="p-5 border-b border-chat-sidebar-foreground/10 flex items-start justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-primary-foreground tracking-tight">
            🤖 AssistBot
          </h1>
          <p className="text-xs text-chat-sidebar-foreground/60 mt-1">
            HRX • ITSM • Cerework
          </p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-chat-sidebar-foreground/60 hover:text-chat-sidebar-foreground transition-colors mt-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-chat-sidebar-active text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-chat-sidebar-foreground/40 px-2 mb-2">
          Recent
        </p>
        <div className="space-y-1">
          {history.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-chat-sidebar-foreground/5 transition-colors text-left group"
            >
              <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-50 group-hover:opacity-80" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{item.title}</p>
                <p className="text-[11px] text-chat-sidebar-foreground/40 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {item.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
