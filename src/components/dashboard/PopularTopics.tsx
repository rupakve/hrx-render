import { Zap, HeartPulse, Monitor, Code, Heart } from "lucide-react";

const topics = [
  { label: "Quick start", icon: Zap, colorClass: "bg-cere-pink/20 text-cere-pink" },
  { label: "Health & wellness", icon: HeartPulse, colorClass: "bg-primary/20 text-primary" },
  { label: "Computer", icon: Monitor, colorClass: "bg-cere-blue/20 text-cere-blue" },
  { label: "Software", icon: Code, colorClass: "bg-cere-teal/20 text-cere-teal" },
];

const PopularTopics = () => (
  <div className="my-5">
    <h3 className="text-base font-semibold text-foreground mb-4">Popular Topics</h3>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {topics.map((topic) => (
        <div
          key={topic.label}
          className="relative bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)] rounded-[18px] p-6 md:p-8 text-center hover:scale-[1.02] transition-transform cursor-pointer group"
        >
          <button className="absolute top-3 right-4 text-white/20 hover:text-white/60 transition-colors">
            <Heart size={14} />
          </button>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3.5 ${topic.colorClass}`}>
            <topic.icon size={20} />
          </div>
          <p className="text-sm font-medium text-foreground/90">{topic.label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PopularTopics;
