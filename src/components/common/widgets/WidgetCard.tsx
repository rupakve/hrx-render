import type { WidgetData } from "@/types/chat";

import LeaveWidget from "./cerework/LeaveWidget";
import GoalWidget from "./cerework/GoalWidget";
import CereworkTableWidget from "./cerework/CereworkTableWidget";
import ItsmIncidentTableWidget from "./itsm/ItsmIncidentTableWidget";
import OptionsWidget from "./shared/OptionsWidget";

const WidgetCard = ({
  data,
  onSelect,
}: {
  data: WidgetData;
  onSelect?: (value: string) => void;
}) => {
  switch (data.type) {
    case "table":
      if (data.source === "itsm")
        return <ItsmIncidentTableWidget data={data} />;
      // cerework and crm table widgets will be added later
      if (data.source === "cerework")
        return <CereworkTableWidget data={data} />;
      return null;

    case "options":
      return <OptionsWidget data={data} onSelect={onSelect ?? (() => {})} />;

    case "cere_work":
      if (data.action === "leave_balance") return <LeaveWidget data={data} />;
      return <GoalWidget data={data} />;
  }
};

export default WidgetCard;
