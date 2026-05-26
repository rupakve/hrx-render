//src/hooks/useNotifications
import { useQuery } from "@tanstack/react-query";
import { fetchPendingNotifications } from "@/services/notificationService";
import { getAuth } from "@/lib/authStorage";

export function useNotifications() {
  const auth = getAuth();
  const userId = auth?.user?.user_id;

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: fetchPendingNotifications,
    enabled: !!userId, // only run if logged in
    refetchInterval: 10_000, // poll every 60 seconds
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.notifications?.length ?? 0,
    isLoading,
  };
}
