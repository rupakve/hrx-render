// ─── Shared style maps ───────────────────────────────────────────────────────

export const accentBorder = {
  hrx: "border-l-widget-hrx",
  itsm: "border-l-widget-itsm",
  cerework: "border-l-widget-cerework",
};

export const sourceBadge = {
  hrx: "bg-widget-hrx/10 text-widget-hrx",
  itsm: "bg-widget-itsm/10 text-widget-itsm",
  cerework: "bg-widget-cerework/10 text-widget-cerework",
};

export const actionPrimary = {
  hrx: "bg-widget-hrx hover:bg-widget-hrx/90 text-white",
  itsm: "bg-widget-itsm hover:bg-widget-itsm/90 text-white",
  cerework: "bg-widget-cerework hover:bg-widget-cerework/90 text-white",
};

export const sourceLabels = {
  hrx: "HRX",
  itsm: "ITSM",
  cerework: "Cerework",
};

// ─── Shared sub-components ───────────────────────────────────────────────────

export const Card = ({
  source,
  children,
  className = "",
}: {
  source: "hrx" | "itsm" | "cerework";
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-card rounded-xl shadow-widget border border-border border-l-4 ${accentBorder[source]} animate-slide-up ${className}`}
  >
    <div className="p-5">{children}</div>
  </div>
);

export const SourceBadge = ({
  source,
}: {
  source: "hrx" | "itsm" | "cerework";
}) => (
  <span
    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${sourceBadge[source]}`}
  >
    {sourceLabels[source]}
  </span>
);

export const StatusBadge = ({
  status,
  color,
}: {
  status: string;
  color: string;
}) => {
  const map: Record<string, string> = {
    green: "bg-accent/15 text-accent",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-destructive/15 text-destructive",
    blue: "bg-primary/10 text-primary",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${map[color] ?? map.blue}`}
    >
      {status}
    </span>
  );
};

export const LeaveBar = ({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) => {
  const remaining = total - used;
  const pct = Math.round((remaining / total) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <span className="text-xs font-semibold text-card-foreground">
          {remaining}{" "}
          <span className="text-muted-foreground font-normal">/ {total}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-widget-cerework transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
