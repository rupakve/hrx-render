import type { CereWorkWidget } from "@/types/chat";
import {
  Card,
  SourceBadge,
  StatusBadge,
  LeaveBar,
  actionPrimary,
} from "../shared";

const leaveStatusMap: Record<string, { label: string; color: string }> = {
  "1": { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  "2": { label: "Approved", color: "bg-accent/15 text-accent" },
  "3": { label: "Rejected", color: "bg-destructive/15 text-destructive" },
};

const LeaveWidget = ({ data }: { data: CereWorkWidget }) => (
  <Card source="cerework">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SourceBadge source="cerework" />
          <StatusBadge status="Active" color="green" />
        </div>
        <h3 className="font-semibold text-card-foreground text-[15px]">
          Leave Balance
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {data.employee?.name} · {data.employee?.emp_id}
        </p>
      </div>
    </div>

    {/* Progress bars — uncomment to show leave quota */}
    {/* {data.leave && (
      <div className="space-y-3 mb-4">
        <LeaveBar label="Casual" used={data.leave.casual.used} total={data.leave.casual.total} />
        <LeaveBar label="Sick"   used={data.leave.sick.used}   total={data.leave.sick.total} />
        <LeaveBar label="Earned" used={data.leave.earned.used} total={data.leave.earned.total} />
      </div>
    )} */}

    {/* Leave history */}
    {data.leave_history && data.leave_history.length > 0 && (
      <div className="mt-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Recent History
        </p>
        <div className="space-y-2">
          {data.leave_history.map((item) => {
            const s = leaveStatusMap[item.status] ?? {
              label: "Unknown",
              color: "bg-primary/10 text-primary",
            };
            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {item.leave_type}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.start_date} → {item.end_date}
                  </p>
                  {item.reason && (
                    <p className="text-[11px] text-muted-foreground italic">
                      {item.reason}
                    </p>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-3 ${s.color}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Actions — uncomment to show buttons */}
    {/* <div className="flex gap-2 mt-5 pt-4 border-t border-border">
      <button className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.cerework}`}>
        Apply Leave
      </button>
      <button className="text-xs font-medium px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
        View History
      </button>
    </div> */}
  </Card>
);

export default LeaveWidget;
