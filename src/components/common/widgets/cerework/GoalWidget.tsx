import type { CereWorkWidget } from "@/types/chat";
import { Card, SourceBadge, actionPrimary } from "../shared";

const goalStatusColor: Record<string, string> = {
  Completed: "bg-accent/15 text-accent",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Planned: "bg-primary/10 text-primary",
};

const GoalWidget = ({ data }: { data: CereWorkWidget }) => {
  if (data.action === "add_goal") {
    return (
      <Card source="cerework">
        <div className="flex items-center gap-2 mb-3">
          <SourceBadge source="cerework" />
        </div>
        <h3 className="font-semibold text-card-foreground text-[15px] mb-1">
          Add New Goal
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Provide goal title, target date, and department to create a new goal.
        </p>
        <div className="flex gap-2 pt-4 border-t border-border">
          <button
            className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.cerework}`}
          >
            Add Goal
          </button>
        </div>
      </Card>
    );
  }

  if (data.action === "goal_menu") {
    return (
      <Card source="cerework">
        <div className="flex items-center gap-2 mb-3">
          <SourceBadge source="cerework" />
        </div>
        <p className="text-sm text-muted-foreground">
          Try: "show my goals", "next goals", or "add a goal".
        </p>
      </Card>
    );
  }

  // previous_goals or next_goals
  return (
    <Card source="cerework">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SourceBadge source="cerework" />
          </div>
          <h3 className="font-semibold text-card-foreground text-[15px]">
            {data.action === "previous_goals"
              ? "Previous Goals"
              : "Upcoming Goals"}
          </h3>
        </div>
      </div>
      <div className="space-y-2.5">
        {data.goals?.map((goal, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {goal.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Due: {goal.due}
              </p>
            </div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-3 ${goalStatusColor[goal.status] ?? "bg-primary/10 text-primary"}`}
            >
              {goal.status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <button
          className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.cerework}`}
        >
          View All
        </button>
      </div>
    </Card>
  );
};

export default GoalWidget;
