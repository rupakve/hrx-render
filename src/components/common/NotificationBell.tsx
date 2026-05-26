// components/common/NotificationBell.tsx
import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationItem } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import { getAuth } from "@/lib/authStorage";
import { useChat } from "@/context/ChatContext";

function timeAgo(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

function sourceBadge(source_type: string) {
  const map: Record<string, string> = {
    usms: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    cerework: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    hrx: "bg-accent/20 text-accent border border-accent/30",
    crm: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    leave: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    leave_decision: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
    state_change: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  };
  return (
    map[source_type] ??
    "bg-white/10 text-muted-foreground border border-white/10"
  );
}

function parseMessage(text: string) {
  // handles **bold**, <b>bold</b>, <i>italic</i>
  const parts = text.split(/(\*\*.*?\*\*|<b>.*?<\/b>|<i>.*?<\/i>)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("<b>") && part.endsWith("</b>")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(3, -4)}
        </strong>
      );
    }
    if (part.startsWith("<i>") && part.endsWith("</i>")) {
      return (
        <em key={i} className="italic text-foreground/80">
          {part.slice(3, -4)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function NotificationCard({
  item,
  onDismiss,
  onOptionClick,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
  onOptionClick: (item: NotificationItem, value: string) => void;
}) {
  const [loadingValue, setLoadingValue] = useState<string | null>(null); // ← add this

  const handleClick = async (value: string) => {
    setLoadingValue(value); // ← set which button is loading
    await onOptionClick(item, value);
    setLoadingValue(null); // ← reset after done
  };
  return (
    <div className="px-4 py-3 hover:bg-white/5 transition border-b border-white/10 last:border-0">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${sourceBadge(item.source_type)}`}
          >
            {item.source_type_label}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(item.created_at)}
          </span>
        </div>
        {/* Commented Temporarily */}
        <button
          onClick={() => onDismiss(item.id)}
          className="text-muted-foreground hover:text-foreground transition flex-shrink-0 mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message */}
      {/* <p className="text-xs text-foreground/60 mt-2 leading-relaxed font-light">{item.pending_message}</p> */}

      <p className="text-xs text-foreground/60 mt-2 leading-relaxed font-light">
        {parseMessage(item.pending_message)}
      </p>

      {/* Option buttons */}
      {item.options.length > 0 && (
        <div className="flex gap-2 mt-3">
          {item.options.map((opt, index) => (
            <button
              key={opt.value}
              onClick={() => handleClick(opt.value)}
              disabled={loadingValue !== null}
              className={`text-xs font-medium px-5 py-1.5 rounded-full transition
          ${
            index === 0
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-white/10 text-foreground border border-white/10 hover:bg-white/15"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingValue === opt.value ? "...wait" : opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { notifications } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useChat();

  const visible = notifications.filter((n) => !dismissed.has(n.id));
  const activeCount = visible.length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  }; */

  /* Single Notification Seen Section */
  const handleDismiss = async (id: string) => {
    const auth = getAuth();
    if (!auth) return;

    const notification = notifications.find((n) => n.id === id);
    setDismissed((prev) => new Set(prev).add(id));

    if (!notification) return;

    try {
      const payload =
        notification.options.length > 0
          ? {
              notification_id: notification.id,
              user_id: auth.user.user_id,
              action:
                notification.options[notification.options.length - 1].value,
              source_type: notification.source_type,
              type: "action", // ← added
            }
          : {
              notification_id: notification.id,
              user_id: auth.user.user_id,
              source_type: notification.source_type,
              type: "mark_seen", // ← added
            };

      await apiClient("/notifications/action", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Dismiss action failed", err);
    }
  };

  /* Multiple notification - Dismiss All Section */
  const handleDismissAll = async () => {
    const auth = getAuth();
    if (!auth) return;

    setDismissed(new Set(visible.map((n) => String(n.id))));
    setOpen(false);

    // now includes ALL notifications, not just ones with options
    const payload = visible.map((n) =>
      n.options.length > 0
        ? {
            notification_id: n.id,
            user_id: auth.user.user_id,
            action: n.options[n.options.length - 1].value,
            source_type: n.source_type,
            type: "action", // ← added
          }
        : {
            notification_id: n.id,
            user_id: auth.user.user_id,
            source_type: n.source_type,
            type: "mark_seen", // ← added
          },
    );

    try {
      await apiClient("/notifications/action", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Dismiss all failed", err);
    }
  };

  // ── source_type: usms → send to chat API ─────────────────────────────────
  const handleUsmsAction = async (_item: NotificationItem, value: string) => {
    if (value === "Yes") {
      await sendMessage(value);
    } else {
      await handleNotificationAction(_item, value);
    }
  };

  // ── source_type: new_incident_alert → send to chat API ─────────────────────────────────
  const handleNewIncidentAction = async (
    _item: NotificationItem,
    value: string,
  ) => {
    if (value === "Yes") {
      await sendMessage(value);
    } else {
      await handleNotificationAction(_item, value);
    }
  };

  // ── source_type: leave → TODO: wire when leave API is ready ──────────────
  const handleLeaveAction = async (item: NotificationItem, value: string) => {
    //console.log(`Leave action: "${value}" for source_id: ${item.source_id}`);
    // TODO: call leave API when ready
    // await apiClient(`/api/leave/action`, {
    //   method: "POST",
    //   body: JSON.stringify({ source_id: item.source_id, action: value }),
    // });
    await handleNotificationAction(item, value);
  };

  // ── main router — add new source_types here as APIs become ready ─────────
  const handleOptionClick = async (item: NotificationItem, value: string) => {
    /* handleDismiss(item.id);
    setOpen(false); */

    if (item.source_type === "usms") {
      await handleUsmsAction(item, value);
    } else if (item.source_type === "leave") {
      await handleLeaveAction(item, value);
    } else if (item.source_type === "new_incident_alert") {
      await handleNewIncidentAction(item, value);
    }
    // else if (item.source_type === "cerework") { await handleCereworkAction(item, value) }
    // else if (item.source_type === "crm")      { await handleCrmAction(item, value) }

    handleDismiss(item.id);
    setOpen(false);
  };

  // ── generic notification action (No / Reject / etc.) ─────────────────────
  const handleNotificationAction = async (
    item: NotificationItem,
    value: string,
  ) => {
    const auth = getAuth();
    if (!auth) return;

    try {
      await apiClient("/notifications/action", {
        method: "POST",
        body: JSON.stringify({
          notification_id: item.id,
          user_id: auth.user.user_id,
          action: value,
          source_type: item.source_type,
        }),
      });
    } catch (err) {
      console.error("Notification action failed", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-white/10 transition text-muted-foreground hover:text-foreground"
      >
        <Bell size={20} />
        {activeCount > 0 && (
          <span
            className="absolute top-1 right-1 flex items-center justify-center
                       min-w-[16px] h-4 px-0.5 bg-destructive rounded-full
                       text-[10px] font-bold text-white border border-background"
          >
            {activeCount > 9 ? "9+" : activeCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="fixed left-3 right-3 top-[70px] z-[100]
           sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96
           rounded-2xl overflow-hidden
           border border-white/10 shadow-chat animate-fade-in
           bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)]"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10
                       bg-[hsl(220_40%_3%)]"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">
                Notifications
              </h3>
              {activeCount > 0 && (
                <span
                  className="bg-destructive/10 text-destructive border border-destructive/50
                             text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                >
                  {activeCount} pending
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto bg-black">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="w-8 h-8 text-white/10 mb-2" />
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              visible.map((n) => (
                <NotificationCard
                  key={n.id}
                  item={n}
                  onDismiss={handleDismiss}
                  onOptionClick={handleOptionClick}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {/* Commented Temporarily */}
          {visible.length > 0 && (
            <div
              className="px-4 py-2.5 border-t border-white/10 flex justify-between
                         items-center bg-[hsl(220_40%_3%)]"
            >
              <button
                onClick={handleDismissAll}
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                Dismiss all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
