//types/notification.ts
export type NotificationOption = {
  label: string;
  value: string;
};

export type NotificationItem = {
  id: string;
  source_type: string;
  source_id: string;
  created_at: string;
  pending_message: string;
  options: NotificationOption[];
};

export type NotificationResponse = {
  user_id: number;
  notifications: NotificationItem[];
};
