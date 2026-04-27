import { Heart, PenSquare, FileText } from "lucide-react";

interface RequestItem {
  type: "request";
  tag: string;
  title: string;
  subtitle: string;
  price: string;
}

interface ArticleItem {
  type: "article";
  tag: string;
  title: string;
  description: string;
  timeAgo: string;
  readTime: string;
}

type RecommendedItem = RequestItem | ArticleItem;

const items: RecommendedItem[] = [
  {
    type: "request",
    tag: "REQUEST",
    title: "Developer Laptop (Mac)",
    subtitle: "Macbook pro M3 Max",
    price: "$1,499.00",
  },
  {
    type: "article",
    tag: "ARTICLE",
    title: "Avoid phishing scams in 2024",
    description: "Phishing scams are typically fraudulent email messages appearing to come from legitimate enterprises. Learn how AI detects them before you click.",
    timeAgo: "3mo ago",
    readTime: "5 min read",
  },
  {
    type: "article",
    tag: "ARTICLE",
    title: "Create An Email Signature",
    description: "To create a personalized email signature: Open a new message. On the Message tab, in the Include group, click Signature.",
    timeAgo: "3mo ago",
    readTime: "5 min read",
  },
  {
    type: "article",
    tag: "ARTICLE",
    title: "Avoid phishing scams in 2024",
    description: "Phishing scams are typically fraudulent email messages appearing to come from legitimate enterprises.",
    timeAgo: "3mo ago",
    readTime: "5 min read",
  },
];

const RequestCard = ({ item }: { item: RequestItem }) => (
  <div className="relative min-w-[280px] bg-gradient-to-b from-[hsl(220_35%_6%)] to-[hsl(220_45%_3%)] rounded-[18px] p-5 text-foreground flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_25px_50px_rgba(0,0,0,0.8)] min-h-[260px]">
    <button className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors">
      <Heart size={14} />
    </button>
    <span className="inline-flex items-center gap-1.5 bg-cere-purple/15 text-cere-purple px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide w-fit">
      <PenSquare size={12} /> {item.tag}
    </span>
    <h5 className="mt-3.5 text-lg font-semibold">{item.title}</h5>
    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
    <div className="my-4 bg-secondary/50 rounded-xl p-4 flex items-center justify-center">
      <Monitor className="w-24 h-16 text-muted-foreground/30" />
    </div>
    <div className="flex justify-between items-center mt-auto">
      <span className="text-base font-semibold">{item.price}</span>
      <a href="#" className="text-xs font-semibold text-accent hover:underline">View Details</a>
    </div>
  </div>
);

const Monitor = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const ArticleCard = ({ item }: { item: ArticleItem }) => (
  <div className="relative min-w-[280px] bg-gradient-to-b from-[hsl(220_35%_6%)] to-[hsl(220_45%_3%)] rounded-[18px] p-5 text-foreground min-h-[260px] flex flex-col">
    <button className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors">
      <Heart size={14} />
    </button>
    <span className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide w-fit">
      <FileText size={12} /> {item.tag}
    </span>
    <h5 className="mt-3.5 text-lg font-semibold leading-snug">{item.title}</h5>
    <p className="text-sm text-muted-foreground leading-relaxed mt-2.5 flex-1">{item.description}</p>
    <div className="flex justify-between text-xs text-muted-foreground border-t border-white/5 pt-3.5 mt-4">
      <span>{item.timeAgo}</span>
      <span>{item.readTime}</span>
    </div>
  </div>
);

const RecommendedForYou = () => (
  <div>
    <h3 className="text-base font-semibold text-foreground mb-4">Recommended for You</h3>
    <div className="flex gap-2.5 overflow-x-auto pb-3">
      {items.map((item, i) =>
        item.type === "request" ? (
          <RequestCard key={i} item={item} />
        ) : (
          <ArticleCard key={i} item={item} />
        )
      )}
    </div>
  </div>
);

export default RecommendedForYou;
