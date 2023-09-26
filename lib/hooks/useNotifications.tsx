import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../fetchers";
import { Notification } from "@prisma/client";

export default function useNotifications({
  queryKey,
  initialData,
}: {
  queryKey: (string | null | undefined)[];
  initialData: {
    notifications: Notification[];
  };
}) {
  return useQuery({
    queryKey: queryKey,
    queryFn: fetchNotifications,
    initialData: initialData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
