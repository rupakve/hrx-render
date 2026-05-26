//mappers/chatMappers.ts
import type { ApiResponse, ModuleTable, OptionItem } from "@/types/api";
import type { ChatResponse } from "@/types/chat";

export const mapApiToChatResponse = (apiRes: ApiResponse): ChatResponse => {
  const message = apiRes.reply || apiRes.message || "No data found";
  const uploadExpect = apiRes.upload_expect ?? null;
  switch (apiRes.module) {
    case "hrx":
      return { message, widgets: [], uploadExpect };

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
          message: usmsMessage,
          widgets: [{ type: "options", source: "itsm", options }],
          uploadExpect,
        };
      }

      const tables = moduleRes?.table as ModuleTable[] | undefined;
      if (tables && tables.length > 0) {
        return {
          message: usmsMessage,
          widgets: [{ type: "table", source: "itsm", tables }],
          uploadExpect,
        };
      }

      return { message: usmsMessage, widgets: [], uploadExpect };
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
          uploadExpect,
        };
      }

      const tables = moduleRes?.table as ModuleTable[] | undefined;
      if (tables && tables.length > 0) {
        return {
          message: cereworkMessage,
          widgets: [{ type: "table", source: "cerework", tables }],
          uploadExpect,
        };
      }

      return { message: cereworkMessage, widgets: [], uploadExpect };
    }

    default:
      return { message, widgets: [], uploadExpect };
  }
};
