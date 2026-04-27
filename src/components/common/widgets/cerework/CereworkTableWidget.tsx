import type { TableWidget } from "@/types/chat";
import { SourceBadge } from "../shared";

const HIDDEN_COLUMNS = new Set(["id", "reason_reject"]);

const statusMap: Record<string, { label: string; color: string }> = {
  Pending: {
    label: "Pending",
    color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  },
  Approved: {
    label: "Approved",
    color: "bg-accent/15 text-accent border border-accent/20",
  },
  Rejected: {
    label: "Rejected",
    color: "bg-red-500/15 text-red-400 border border-red-500/20",
  },
};

const renderCell = (col: string, value: string | number | null) => {
  if (value === null || value === undefined || value === "")
    return <span className="text-white/20">—</span>;

  if (col === "status") {
    const s = statusMap[String(value)] ?? {
      label: String(value),
      color: "bg-white/10 text-white/50",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${s.color}`}
      >
        {s.label}
      </span>
    );
  }

  if (col === "leave_type") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-widget-cerework/15 border border-widget-cerework/30 text-widget-cerework text-xs font-semibold">
        {String(value)}
      </span>
    );
  }

  return <span className="text-card-foreground">{String(value)}</span>;
};

const formatHeader = (col: string) =>
  col.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CereworkTableWidget = ({ data }: { data: TableWidget }) => (
  <div className="flex flex-col gap-4 w-full max-w-2xl">
    {data.tables.map((table, i) => {
      const visibleCols = table.columns.filter((c) => !HIDDEN_COLUMNS.has(c));
      return (
        <div
          key={i}
          className="rounded-xl border border-border border-l-4 border-l-widget-cerework bg-card shadow-widget animate-slide-up overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-white/[0.02]">
            <SourceBadge source="cerework" />
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
                {table.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-border/40 last:border-0 transition-colors hover:bg-white/[0.03] ${
                      rowIdx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                    }`}
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

export default CereworkTableWidget;
