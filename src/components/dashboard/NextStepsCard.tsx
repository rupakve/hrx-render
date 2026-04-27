//components/dashboard/NextStepsCard.tsx
import { ExternalLink, Sparkles } from "lucide-react";

type BadgeVariant = "lead" | "quote" | "opportunity";

interface NextStep {
  badge: string;
  variant: BadgeVariant;
  title: string;
  description: string;
}

const steps: NextStep[] = [
  {
    badge: "LEAD",
    variant: "lead",
    title: "Lead 123456",
    description:
      "This Lead is about Mr. Boye Recent call dec 21st, proposed to schedule a next Meeting early Jan 26.",
  },
  {
    badge: "Quote",
    variant: "quote",
    title: "Quote 234567",
    description:
      "This Quote was most recent worked on Dec 20st. Its value 250K USD",
  },
  {
    badge: "Opportunity",
    variant: "opportunity",
    title: "Opportunity 123456",
    description:
      "This Opportunity is named xxxxxxx with a minimal Order Value. The Status is open",
  },
  {
    badge: "LEAD",
    variant: "lead",
    title: "Lead 789012",
    description:
      "This Lead is about Mr. Boye Recent call dec 21st, proposed to schedule a next Meeting early Jan 26.",
  },
  {
    badge: "Quote",
    variant: "quote",
    title: "Quote 345678",
    description:
      "This Quote was most recent worked on Dec 20st. Its value 250K USD",
  },
];

const badgeStyles: Record<BadgeVariant, string> = {
  lead: "bg-cere-blue/15 text-cere-blue border-cere-blue/30",
  quote: "bg-cere-amber/15 text-cere-amber border-cere-amber/30",
  opportunity: "bg-primary/15 text-primary border-primary/30",
};

const NextStepsCard = ({ step }: { step: NextStep }) => (
  <div className="relative min-w-[280px] flex-[0_0_31%] p-5 rounded-[20px] bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_30px_60px_rgba(0,0,0,0.65)] overflow-hidden">
    {/* Glow corner */}
    <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

    <div className="flex justify-between items-start relative z-10">
      <span
        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase ${badgeStyles[step.variant]}`}
      >
        {step.badge}
      </span>
      <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
        <ExternalLink size={12} className="text-muted-foreground" />
      </button>
    </div>

    <h6 className="mt-3.5 text-lg font-semibold text-foreground">
      {step.title}
    </h6>
    <p className="text-sm text-muted-foreground leading-relaxed mt-2 min-h-[70px]">
      {step.description}
    </p>

    <div className="h-px bg-white/8 my-4" />

    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
      <Sparkles size={12} />
      AI Suggestion
    </div>
  </div>
);

const NextSteps = () => (
  <div>
    <h3 className="text-base font-semibold text-foreground my-5">
      My Next Steps
    </h3>
    <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-thin">
      {steps.map((step, i) => (
        <NextStepsCard key={i} step={step} />
      ))}
    </div>
  </div>
);

export default NextSteps;
