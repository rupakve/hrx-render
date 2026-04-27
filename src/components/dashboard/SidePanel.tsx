import { useState } from "react";
import {
  Briefcase,
  PenSquare,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface TaskItem {
  tag: string;
  tagColor: "red" | "green";
  title: string;
  subtitle: string;
  value?: string;
  overdue?: boolean;
  actions?: ("approve" | "reject" | "view")[];
}

interface PanelSection {
  label: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  count: number;
  defaultOpen?: boolean;
  priorityLabel?: string;
  tasks: TaskItem[];
}

const sections: PanelSection[] = [
  {
    label: "Relations",
    icon: Briefcase,
    iconBg: "bg-cere-blue/20",
    iconColor: "text-cere-blue",
    count: 9,
    defaultOpen: true,
    priorityLabel: "PRIORITIZED ACTIONS (3)",
    tasks: [
      {
        tag: "OVERDUE 5 DAYS",
        tagColor: "red",
        title: "REQ0010006",
        subtitle: "Adrian Hunt • Enterprise License",
        value: "$1,499.00",
        overdue: true,
        actions: ["approve", "reject"],
      },
      {
        tag: "ON TRACK",
        tagColor: "green",
        title: "Career Growth Review",
        subtitle: "Adrian Hunt • Q1 2024",
        actions: ["view"],
      },
      {
        tag: "ON TRACK",
        tagColor: "green",
        title: "Career Growth Review",
        subtitle: "Adrian Hunt • Q1 2024",
        actions: ["view"],
      },
    ],
  },
  {
    label: "My Requests",
    icon: PenSquare,
    iconBg: "bg-cere-purple/20",
    iconColor: "text-cere-purple",
    count: 4,
    tasks: [
      {
        tag: "ON TRACK",
        tagColor: "green",
        title: "Career Growth Review",
        subtitle: "Adrian Hunt • Q1 2024",
        actions: ["view"],
      },
    ],
  },
  {
    label: "Surveys",
    icon: BookOpen,
    iconBg: "bg-cere-amber/20",
    iconColor: "text-cere-amber",
    count: 1,
    tasks: [
      {
        tag: "ON TRACK",
        tagColor: "green",
        title: "Career Growth Review",
        subtitle: "Adrian Hunt • Q1 2024",
        actions: ["view"],
      },
    ],
  },
];

const tagStyles = {
  red: "bg-destructive/15 text-destructive border border-destructive/40",
  green: "bg-primary/15 text-primary",
};

const SidePanel = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.label, !!s.defaultOpen])),
  );

  const toggle = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="pt-5">
      <h3 className="text-base font-semibold text-foreground mb-4">
        Where did I left off
      </h3>
      <div className="rounded-[18px] overflow-hidden border border-primary/20 bg-gradient-to-b from-[hsl(160_25%_10%)] to-[hsl(160_25%_10%)] shadow-xl">
        {sections.map((section) => (
          <div key={section.label}>
            {/* Header */}
            <button
              onClick={() => toggle(section.label)}
              className="w-full flex items-center justify-between px-4 py-4 bg-[hsl(220_40%_4%)] border-b border-secondary hover:bg-[hsl(220_40%_5%)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${section.iconBg}`}
                >
                  <section.icon size={15} className={section.iconColor} />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  {section.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-white/10 rounded-full px-2 py-0.5 text-xs">
                  {section.count}
                </span>
                {openSections[section.label] ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
            </button>

            {/* Content */}
            {openSections[section.label] && (
              <div className="animate-fade-in">
                {section.priorityLabel && (
                  <div className="bg-card px-4 py-2.5 text-xs font-semibold tracking-wide text-primary">
                    {section.priorityLabel}
                  </div>
                )}
                {section.tasks.map((task, i) => (
                  <div
                    key={i}
                    className={`mx-3 my-3 p-4 rounded-[14px] bg-gradient-to-b from-[hsl(220_35%_6%)] to-[hsl(220_45%_3%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ${
                      task.overdue
                        ? "border border-destructive/35 border-r-4 border-r-destructive/45"
                        : ""
                    }`}
                  >
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2.5 ${tagStyles[task.tagColor]}`}
                    >
                      {task.tag}
                    </span>
                    <div className="font-semibold text-foreground">
                      {task.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.subtitle}
                    </div>
                    {task.value && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Value:{" "}
                        <strong className="text-foreground text-sm">
                          {task.value}
                        </strong>
                      </div>
                    )}
                    {task.actions && (
                      <div className="flex gap-2.5 mt-3.5">
                        {task.actions.includes("approve") && (
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all">
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {task.actions.includes("reject") && (
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-muted-foreground border border-white/8 text-xs font-bold hover:bg-secondary/80 transition-colors">
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                        {task.actions.includes("view") &&
                          !task.actions.includes("approve") && (
                            <button className="w-full py-2 rounded-lg bg-secondary text-muted-foreground border border-white/8 text-xs font-bold hover:bg-secondary/80 transition-colors">
                              View Details
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                ))}
                {section.label === "Relations" && (
                  <div className="text-center py-3.5 text-sm text-primary cursor-pointer hover:underline">
                    View all pending items &gt;
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel;
