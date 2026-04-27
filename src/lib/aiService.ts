// services/aiService.ts
import { apiClient } from "./apiClient";

export const aiService = {
  async getWidgets(query: string) {
    return apiClient("/ai/widgets", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },
};
