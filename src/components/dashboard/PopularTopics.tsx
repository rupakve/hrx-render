//components/dashboard/PopularTopics.tsx
import { Heart } from "lucide-react";
import QuickStartIcon from "@/assets/iconBox.svg";
import HealthIcon from "@/assets/iconBox2.svg";
import ComputerIcon from "@/assets/iconBox3.svg";
import SoftwareIcon from "@/assets/iconBox4.svg";

const topics = [
  {
    label: "Quick start",
    icon: QuickStartIcon,
    bg: "bg-pink-500/20",
    border: "border-pink-500/10",
  },
  {
    label: "Health & wellness",
    icon: HealthIcon,
    bg: "bg-primary/20",
    border: "border-primary/10",
  },
  {
    label: "Computer",
    icon: ComputerIcon,
    bg: "bg-blue-500/20",
    border: "border-blue-500/10",
  },
  {
    label: "Software",
    icon: SoftwareIcon,
    bg: "bg-teal-500/20",
    border: "border-teal-500/10",
  },
];

const PopularTopics = () => (
  <div className="my-5">
    <h3 className="text-base font-semibold text-foreground mb-4">
      Popular Topics
    </h3>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {topics.map((topic) => (
        <div
          key={topic.label}
          className="relative bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)]
                     rounded-[18px] p-6 text-center hover:scale-[1.02]
                     transition-transform cursor-pointer
                     shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {/* Favorite button */}
          <button className="absolute top-3 right-4 text-white/20 hover:text-white/60 transition-colors">
            <Heart size={14} />
          </button>

          {/* Icon box */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center
                        mx-auto mb-4 border ${topic.bg} ${topic.border}`}
          >
            <img
              src={topic.icon}
              alt={topic.label}
              className="w-7 h-7 object-contain"
            />
          </div>

          {/* Label */}
          <p className="text-xs font-medium text-foreground/90 leading-snug">
            {topic.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default PopularTopics;
