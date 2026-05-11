//services/notificationService
import { apiClient } from "@/lib/apiClient";
import { getAuth } from "@/lib/authStorage";
import type { NotificationResponse } from "@/types/notification";

const NOTIFICATION_BASE_URL =
  //import.meta.env.VITE_NOTIFICATION_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL;

// ─── Dummy data — swap out once real API is ready ───────────────────────────
const DUMMY_DATA: NotificationResponse = {
  user_id: 20,
  notifications: [
    {
      id: "usms_pending_20",
      source_type: "usms",
      source_id: "draft_or_sla",
      created_at: "2026-05-06T06:42:27.042476+00:00",
      pending_message:
        "Hello! There is an uncreated incident regarding 'Mic Issue'. Would you like to continue from where you left off?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      id: "usms_pending_21",
      source_type: "cerework",
      source_id: "draft_task",
      created_at: "2026-05-05T10:15:00.000000+00:00",
      pending_message:
        "You have an incomplete task submission for 'Q1 Report Review'. Do you want to resume?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
  ],
};

const USE_DUMMY = false; // flip to false when real API is ready

export async function fetchPendingNotifications(): Promise<NotificationResponse> {
  if (USE_DUMMY) return DUMMY_DATA;

  const auth = getAuth();
  if (!auth?.user?.user_id || !auth?.user?.email) {
    return { user_id: 0, notifications: [] };
  }

  const { user_id, email } = auth.user;

  /*  return await apiClient<NotificationResponse>(
    `/api/notifications/pending/${auth.user.user_id}`,
    {
      params: { email: auth.user.email },
    },
  ); */

  const url = `${NOTIFICATION_BASE_URL}/notifications/pending/${user_id}?email=${encodeURIComponent(email)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", // ← needed for ngrok
    },
  });

  if (!response.ok)
    throw new Error(`Notification API error: ${response.status}`);

  return response.json();
}
