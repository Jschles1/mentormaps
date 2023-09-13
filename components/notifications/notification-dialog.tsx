"use client";

import * as React from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MenuButton from "../navigation/menu-button";
import { Notification, RoadmapInvite } from "@prisma/client";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoadmapData } from "@/lib/interfaces";

interface NotificationDialogProps {
  notifications: Notification[];
}

export default function NotificationDialog({
  notifications,
}: NotificationDialogProps) {
  const params = useParams();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const notificationsQueryKey = ["notifications", userId];

  const dismissNotificationMutation = useMutation({
    mutationFn: (variables: { id: number }) =>
      axios.delete(`/api/notifications/${variables.id}`),
    onSuccess: async (data) => {
      console.log("Mutation success!", data);
      await queryClient.refetchQueries({ queryKey: notificationsQueryKey });
    },
  });
  const notificationLength = notifications?.length;
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
        <MenuButton disabled={disableButton}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-4">
              <Bell size={16} /> Notifications
            </div>
            <div className="px-4">{notificationLength}</div>
          </div>
        </MenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Notifications</DialogTitle>
          <div className="flex flex-col items-start gap-y-4">
            {!!notificationLength ? (
              notifications.map((n: Notification) => (
                <div
                  key={n.message}
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
