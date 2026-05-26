// services/chatService.ts
import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api";

export const fetchChatResponse = async (
  message: string,
  fileData?: { type: string; data: unknown }, // ← add optional fileData
) => {
  const auth = localStorage.getItem("hrxauth");
  const parsed = auth ? JSON.parse(auth) : null;
  const email = parsed?.user?.email;
  const user_id = parsed?.user?.user_id;
  const hrx_session_id = parsed?.hrx_session_id;

  const body: Record<string, unknown> = {
    message,
    user_id,
    email,
    hrx_session_id,
  };

  // ← attach file_data only when present
  if (fileData) {
    body.file_data = fileData;
  }

  return apiClient<ApiResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
};
