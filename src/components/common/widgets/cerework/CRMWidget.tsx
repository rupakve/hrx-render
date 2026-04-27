import { User } from "lucide-react";
import type { CRMWidget } from "@/types/chat";
import { Card, SourceBadge, StatusBadge, actionPrimary } from "../shared";

const CRMWidget = ({ data }: { data: CRMWidget }) => {
  const { customer } = data;
  return (
    <Card source="cerework">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-widget-cerework/15 border border-widget-cerework/30 flex items-center justify-center text-xs font-bold text-widget-cerework">
            {customer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <SourceBadge source="cerework" />
              <StatusBadge
                status={customer.status}
                color={customer.status === "Active" ? "green" : "yellow"}
              />
            </div>
            <h3 className="font-semibold text-card-foreground text-[15px]">
              {customer.name}
            </h3>
          </div>
        </div>
        <User size={14} className="text-muted-foreground mt-1 shrink-0" />
      </div>

      <div className="space-y-2">
        {[
          { label: "Email", value: customer.email },
          { label: "Phone", value: customer.phone },
          { label: "Company", value: customer.company },
        ].map((f) => (
          <div
            key={f.label}
            className="flex justify-between items-center text-xs"
          >
            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
              {f.label}
            </span>
            <span className="text-card-foreground font-medium">{f.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-5 pt-4 border-t border-border">
        <button
          className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.cerework}`}
        >
          View Profile
        </button>
      </div>
    </Card>
  );
};

export default CRMWidget;
