//authService.ts
import { apiClient } from "./apiClient";

interface LoginResponse {
  token: string;
  hrx_session_id: string;
  user: {
    user_id: number | string;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(email: string, password: string) {
    return apiClient<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};
