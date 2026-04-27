import { ChevronDown, TrendingUp, Heart, Activity } from "lucide-react";
import { useState } from "react";

const filters = [
  { label: "Growth suggestions", icon: TrendingUp },
  { label: "Active relationship moments", icon: Heart },
  { label: "Well-being signals", icon: Activity },
];

const FilterBar = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap gap-3 px-2 pb-4">
      {filters.map((filter, i) => (
        <div key={filter.label} className="relative">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-secondary/50 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <filter.icon size={14} className="text-primary" />
            {filter.label}
            <ChevronDown size={12} />
          </button>
          {openIdx === i && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setOpenIdx(null)}
              />
              <div className="absolute top-full mt-1 left-0 w-52 bg-popover border border-border rounded-xl p-2 shadow-xl z-40 animate-fade-in">
                {["Menu item 1", "Menu item 2", "Menu item 3"].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/15 hover:text-primary transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
