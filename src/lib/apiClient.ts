//apiClient.ts
import { getToken } from "@/lib/authStorage";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...config } = options;

  let url = `${BASE_URL}${endpoint}`;

  // Handle query params
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const token = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    ...config,
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
