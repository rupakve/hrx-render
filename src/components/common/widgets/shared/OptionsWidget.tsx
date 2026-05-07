//components/common/widgets/shared/OptionsWidget.tsx
import { useState } from "react";
import type { OptionsWidget } from "@/types/chat";

const BADGE_COLORS = [
  "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
  "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25",
  "bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25",
  "bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25",
  "bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25",
  "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25",
  "bg-pink-500/15 text-pink-400 border border-pink-500/30 hover:bg-pink-500/25",
  "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25",
  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25",
  "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25",
  "bg-teal-500/15 text-teal-400 border border-teal-500/30 hover:bg-teal-500/25",
];

const getBadgeStyle = (index: number) =>
  BADGE_COLORS[index % BADGE_COLORS.length];

const getShortLabel = (label: string) => {
  const parts = label.split(" - ");
  return parts.length > 1 ? parts[1] : label;
};

interface OptionsWidgetProps {
  data: OptionsWidget;
  onSelect: (value: string, label: string) => void;
}

const OptionsWidget = ({ data, onSelect }: OptionsWidgetProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleClick = (value: string, label: string) => {
    if (selectedValue) return; // already selected, do nothing
    setSelectedValue(value);
    onSelect(value, label);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {data.options.map((opt, index) => {
        const isSelected = selectedValue === opt.value;
        const isDisabled = selectedValue !== null && !isSelected;

        return (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value, getShortLabel(opt.label))}
            disabled={isDisabled}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all
              ${
                isDisabled
                  ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                  : isSelected
                    ? `${getBadgeStyle(index)} ring-2 ring-white/30 scale-105`
                    : `${getBadgeStyle(index)} cursor-pointer`
              }`}
          >
            {getShortLabel(opt.label)}
          </button>
        );
      })}
    </div>
  );
};

export default OptionsWidget;
