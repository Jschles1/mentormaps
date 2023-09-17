"use client";

import * as React from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Notification } from "@prisma/client";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/fetchers";

interface NotificationDialogProps {
  notifications: Notification[];
}

export default function NotificationDialog({
  notifications,
}: NotificationDialogProps) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const notificationsQueryKey = ["notifications", userId];

  const { data: notificationsData } = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    initialData: notifications,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const dismissNotificationMutation = useMutation({
    onMutate: async (variables: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const allNotifications = await (queryClient.getQueryData(
        notificationsQueryKey
      ) as Notification[]);
      queryClient.setQueryData(
        notificationsQueryKey,
        allNotifications.filter((n) => n.id !== variables.id)
      );
      console.log("Mutation onMutate!", allNotifications);
      return { allNotifications };
    },
    mutationFn: (variables: { id: number }) =>
      axios.delete(`/api/notifications/${variables.id}`),
    onSuccess: async (data) => {
      console.log("Mutation success!", data);
      await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        notificationsQueryKey,
        context?.allNotifications
      );
    },
  });
  const notificationLength = notificationsData?.length;
  const disableButton = !notificationLength;

  async function handleDismiss(id: number) {
    try {
      dismissNotificationMutation.mutate({ id });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            disabled={disableButton}
            className="hover:bg-lighter-blue-gray focus:bg-lighter-blue-gray focus-within:bg-lighter-blue-gray focus-visible:bg-lighter-blue-gray active:bg-lighter-blue-gray"
          >
            <Bell size={20} color="gray" />
          </Button>
          {!!notificationLength && (
            <div className="absolute text-xs bg-dark-lavender text-white -top-1 -right-1 px-[0.375rem] rounded-full">
              {notificationLength}
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Notifications</DialogTitle>
          <div className="flex flex-col items-start gap-y-4">
            {!!notificationLength ? (
              notificationsData?.map((n: Notification, index: number) => (
                <div
                  key={`${n.message}-${index}`}
                  className="bg-lighter-blue-gray p-3 rounded w-full flex flex-col gap-y-2"
                >
                  <p className="text-black-darkest">{n.message}</p>
                  <div className="flex items-center mt-2 gap-x-2">
                    <Button
                      className="w-full"
                      onClick={() => handleDismiss(n.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray">
                You currently have no pending notifications. Please check again
                later.
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
