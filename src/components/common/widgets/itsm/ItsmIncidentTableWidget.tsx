//components/common/widgets/itsm/itsmIncidentTableWidget
import { useState } from "react";
import type { TableWidget } from "@/types/chat";
import { SourceBadge } from "../shared";

// ─── Config ───────────────────────────────────────────────────────────────────
const INITIAL_ROWS = 5; // ← change this to show more/fewer rows by default

// ─── Columns to hide ──────────────────────────────────────────────────────────
const HIDDEN_COLUMNS = new Set([
  "company_id",
  "caller_user_id",
  "created_by",
  "updated_by",
  "updated_at",
]);

// ─── Special cell renderers ───────────────────────────────────────────────────
const renderCell = (col: string, value: string | number | null) => {
  if (value === null || value === undefined) {
    return <span className="text-white/20">—</span>;
  }

  // Incident number badge
  if (col === "incident_number") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-widget-itsm/15 border border-widget-itsm/30 text-widget-itsm text-xs font-semibold tracking-wide">
        {String(value)}
      </span>
    );
  }

  // State (text-based)
  if (col === "state") {
    const stateMap: Record<string, string> = {
      New: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
      "In Progress":
        "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
      "On Hold": "bg-orange-500/15 text-orange-400 border border-orange-500/20",
      Resolved: "bg-accent/15 text-accent border border-accent/20",
      Closed: "bg-white/10 text-white/40 border border-white/10",
      Assigned: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
    };
    const color =
      stateMap[String(value)] ??
      "bg-white/10 text-white/50 border border-white/10";
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${color}`}
      >
        {String(value)}
      </span>
    );
  }

  // Priority (text-based)
  if (col === "priority") {
    const priorityMap: Record<string, string> = {
      Critical: "bg-red-500/15 text-red-400 border border-red-500/20",
      High: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
      Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
      Low: "bg-accent/15 text-accent border border-accent/20",
    };
    const color =
      priorityMap[String(value)] ??
      "bg-white/10 text-white/50 border border-white/10";
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${color}`}
      >
        {String(value)}
      </span>
    );
  }

  // SLA type badge
  if (col === "sla_type") {
    const isResolution = value === "resolution";
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
          isResolution
            ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
            : "bg-accent/15 text-accent border border-accent/20"
        }`}
      >
        {String(value)}
      </span>
    );
  }

  // Priority badge (numeric)
  if (col === "priority_id") {
    const colors: Record<number, string> = {
      1: "bg-red-500/15 text-red-400 border border-red-500/20",
      2: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
      3: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
      4: "bg-white/10 text-white/50 border border-white/10",
    };
    const labels: Record<number, string> = {
      1: "Critical",
      2: "High",
      3: "Medium",
      4: "Low",
    };
    const num = Number(value);
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors[num] ?? "bg-white/10 text-white/50"}`}
      >
        {labels[num] ?? String(value)}
      </span>
    );
  }

  // State badge (numeric)
  if (col === "state_id") {
    const states: Record<number, { label: string; color: string }> = {
      1: {
        label: "Open",
        color: "bg-accent/15 text-accent border border-accent/20",
      },
      2: {
        label: "In Progress",
        color: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
      },
      3: {
        label: "Resolved",
        color: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
      },
      4: {
        label: "Closed",
        color: "bg-white/10 text-white/40 border border-white/10",
      },
    };
    const num = Number(value);
    const s = states[num] ?? {
      label: String(value),
      color: "bg-white/10 text-white/50",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${s.color}`}
      >
        {s.label}
      </span>
    );
  }

  // Target minutes → human readable
  if (col === "target_minutes") {
    const mins = Number(value);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return (
        <span className="font-semibold text-white/80">
          {m > 0 ? `${h}h ${m}m` : `${h}h`}
        </span>
      );
    }
    return <span className="font-semibold text-white/80">{mins}m</span>;
  }

  return <span className="text-card-foreground">{String(value)}</span>;
};

// ─── Column label formatter ───────────────────────────────────────────────────
const formatHeader = (col: string) =>
  col
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Component ────────────────────────────────────────────────────────────────
const ItsmTableWidget = ({ data }: { data: TableWidget }) => {
  const [expandedTables, setExpandedTables] = useState<Record<number, boolean>>(
    {},
  );

  const toggleExpand = (i: number) => {
    setExpandedTables((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {data.tables.map((table, i) => {
        const visibleCols = table.columns.filter((c) => !HIDDEN_COLUMNS.has(c));
        const isExpanded = expandedTables[i] ?? false;
        const displayedRows = isExpanded
          ? table.rows
          : table.rows.slice(0, INITIAL_ROWS);
        const hasMore = table.rows.length > INITIAL_ROWS;

        return (
          <div
            key={i}
            className="rounded-xl border border-border bg-card shadow-widget animate-slide-up overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-white/[0.02]">
              <SourceBadge source="itsm" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {table.table_name.replace(/_/g, " ")}
              </span>
              <span className="ml-auto text-[10px] text-white/20">
                {table.rows.length}{" "}
                {table.rows.length === 1 ? "record" : "records"}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {visibleCols.map((col) => (
                      <th
                        key={col}
                        className="text-left text-[10px] uppercase tracking-widest text-white/30 font-semibold px-5 py-3 whitespace-nowrap"
                      >
                        {formatHeader(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`border-b border-border/40 last:border-0 transition-colors hover:bg-white/[0.03] ${rowIdx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}`}
                    >
                      {visibleCols.map((col) => (
                        <td key={col} className="px-5 py-3 whitespace-nowrap">
                          {renderCell(col, row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View More / View Less */}
            {hasMore && (
              <div className="px-5 py-3 border-t border-border/40 bg-white/[0.01] flex items-center justify-between">
                <span className="text-[10px] text-white/20">
                  {isExpanded
                    ? `Showing all ${table.rows.length} records`
                    : `Showing ${INITIAL_ROWS} of ${table.rows.length} records`}
                </span>
                <button
                  onClick={() => toggleExpand(i)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                >
                  {isExpanded
                    ? "▲ Show less"
                    : `▼ View ${table.rows.length - INITIAL_ROWS} more`}
                </button>
              </div>
            )}

            {/* Empty state */}
            {table.rows.length === 0 && (
              <div className="px-5 py-8 text-center text-xs text-white/25">
                No records found
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItsmTableWidget;
