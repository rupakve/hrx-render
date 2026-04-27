//chatService.ts
import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api";

export const fetchChatResponse = async (message: string) => {
  const auth = localStorage.getItem("hrxauth");
  const parsed = auth ? JSON.parse(auth) : null;
  const email = parsed?.user?.email;
  const user_id = parsed?.user?.user_id;
  const hrx_session_id = parsed?.hrx_session_id;

  return apiClient<ApiResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, user_id, email, hrx_session_id }),
  });
};
