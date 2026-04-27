import type { OptionsWidget } from "@/types/chat";

// color map based on label keywords
const getBadgeStyle = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("high") || l.includes("1"))
    return "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25";
  if (l.includes("medium") || l.includes("2"))
    return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25";
  if (l.includes("low") || l.includes("3"))
    return "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25";
  return "bg-white/10 text-white/70 border border-white/20 hover:bg-white/15";
};

// extract short label — "1 - High" → "High"
const getShortLabel = (label: string) => {
  const parts = label.split(" - ");
  return parts.length > 1 ? parts[1] : label;
};

interface OptionsWidgetProps {
  data: OptionsWidget;
  onSelect: (value: string) => void;
}

const OptionsWidget = ({ data, onSelect }: OptionsWidgetProps) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {data.options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onSelect(opt.value)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${getBadgeStyle(opt.label)}`}
      >
        {getShortLabel(opt.label)}
      </button>
    ))}
  </div>
);

export default OptionsWidget;
