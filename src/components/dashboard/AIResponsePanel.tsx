//components/dashboard/AIResponsePanel.tsx
import { Sparkles, X } from "lucide-react";
import WidgetCard from "@/components/common/widgets/WidgetCard";
import { ChatResponse, WidgetData } from "@/types/chat";

const AIResponsePanel = ({
  response,
  onClear,
}: {
  response: ChatResponse;
  onClear: () => void;
}) => {
  return (
    <div>
      <h3 className="text-base font-semibold text-foreground my-5">
        My Next Steps
      </h3>

      <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-b from-[hsl(220_40%_4%)] to-[hsl(220_45%_3%)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Sparkles size={16} />
            AI Response
          </div>

          {/* <button
            onClick={onClear}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
          >
            <X size={14} />
          </button> */}
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-4 whitespace-pre-line">
          {response.message}
        </p>

        {/* Widgets */}
        {/* <div className="space-y-3">
          {response.widgets.map((widget: WidgetData, index: number) => (
            <WidgetCard key={index} data={widget} />
          ))}
        </div> */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-3">
          {response.widgets.map((widget: WidgetData, index: number) => (
            <div
              key={index}
              className="w-[480px] min-w-[480px] max-w-[4800px] flex-shrink-0"
            >
              <WidgetCard data={widget} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIResponsePanel;
