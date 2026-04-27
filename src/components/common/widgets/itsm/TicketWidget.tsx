import { Ticket } from "lucide-react";
import type { TicketWidget } from "@/types/chat";
import { Card, SourceBadge, StatusBadge, actionPrimary } from "../shared";

const ticketStatusColor = (status: string) => {
  if (status === "In Progress") return "yellow";
  if (status === "Closed") return "green";
  if (status === "Pending Approval") return "blue";
  return "red";
};

const TicketWidget = ({ data }: { data: TicketWidget }) => {
  const { ticket } = data;
  return (
    <Card source="itsm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SourceBadge source="itsm" />
            <StatusBadge
              status={ticket.status}
              color={ticketStatusColor(ticket.status)}
            />
          </div>
          <h3 className="font-semibold text-card-foreground text-[15px]">
            Ticket #{ticket.id}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{ticket.title}</p>
        </div>
        <Ticket size={14} className="text-muted-foreground mt-1 shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {[
          { label: "Priority", value: ticket.priority },
          { label: "Created On", value: ticket.created_at },
        ].map((f) => (
          <div key={f.label}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {f.label}
            </p>
            <p className="text-sm font-medium text-card-foreground mt-0.5">
              {f.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-5 pt-4 border-t border-border">
        <button
          className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.itsm}`}
        >
          View Details
        </button>
      </div>
    </Card>
  );
};

export default TicketWidget;
