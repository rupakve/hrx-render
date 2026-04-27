import type { ApiResponse, ModuleTable, OptionItem } from "@/types/api";
import type { ChatResponse } from "@/types/chat";

export const mapApiToChatResponse = (apiRes: ApiResponse): ChatResponse => {
  const message = apiRes.reply || apiRes.message || "No data found";

  switch (apiRes.module) {
    case "hrx":
      return { message, widgets: [] };

    case "usms": {
      const moduleRes = apiRes.module_response as Record<string, unknown>;

      const usmsMessage =
        (moduleRes?.reply as string) ||
        apiRes.reply ||
        apiRes.message ||
        "No data found";

      const options = moduleRes?.options as OptionItem[] | undefined;
      if (options && options.length > 0) {
        return {
          message: usmsMessage, // ← was "message"
          widgets: [{ type: "options", source: "itsm", options }],
        };
      }

      const tables = moduleRes?.table as ModuleTable[] | undefined;
      if (tables && tables.length > 0) {
        return {
          message: usmsMessage, // ← was "message"
          widgets: [{ type: "table", source: "itsm", tables }],
        };
      }

      return { message: usmsMessage, widgets: [] }; // ← was "message"
    }

    case "cerework": {
      const moduleRes = apiRes.module_response as Record<string, unknown>;

      const cereworkMessage =
        (moduleRes?.reply as string) ||
        apiRes.reply ||
        apiRes.message ||
        "No data found";

      const options = moduleRes?.options as OptionItem[] | undefined;
      if (options && options.length > 0) {
        return {
          message: cereworkMessage,
          widgets: [{ type: "options", source: "cerework", options }],
        };
      }

      const tables = moduleRes?.table as ModuleTable[] | undefined;
      if (tables && tables.length > 0) {
        return {
          message: cereworkMessage,
          widgets: [{ type: "table", source: "cerework", tables }],
        };
      }

      return { message: cereworkMessage, widgets: [] };
    }

    default:
      return { message, widgets: [] };
  }
};
