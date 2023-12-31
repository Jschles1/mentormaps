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
import { RoadmapInvite } from "@prisma/client";
import { Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoadmapData } from "@/lib/interfaces";
import FormSubmitButton from "../form/form-submit-button";
import { useToast } from "../ui/use-toast";

interface RoadmapInviteDialogProps {
  roadmapInvites: RoadmapInvite[];
  roadmapData: RoadmapData[];
  userId: string;
}

export default function RoadmapInviteDialog({
  roadmapInvites,
  roadmapData,
  userId,
}: RoadmapInviteDialogProps) {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];

  const inviteResponseMutation = useMutation({
    mutationFn: (variables: { roadmapId: number; accepted: boolean }) =>
      axios.post("/api/roadmap-invites/invite-response", {
        accepted: variables.accepted,
        roadmapId: variables.roadmapId,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roadmapInvitesQueryKey });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      if (params.roadmapId) {
        queryClient.invalidateQueries({
          queryKey: ["roadmap", params.roadmapId],
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      toast({
        title: "Something went wrong!",
        description: `Error: ${errorMessage}`,
      });
    },
  });
  const inviteLength = roadmapInvites?.length;
  const disableInviteButton = !inviteLength;

  async function handleAccept(id: number) {
    inviteResponseMutation.mutate({ roadmapId: id, accepted: true });
  }

  async function handleDecline(id: number) {
    inviteResponseMutation.mutate({ roadmapId: id, accepted: true });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MenuButton disabled={disableInviteButton}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-4">
              <Mail size={16} /> Roadmap Invites
            </div>
            <div className="px-4">{inviteLength}</div>
          </div>
        </MenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Pending Invites</DialogTitle>
          <div className="flex flex-col items-start gap-y-4">
            {roadmapData?.length ? (
              roadmapData.map((data: RoadmapData) => (
                <div
                  key={data.roadmapId}
                  className="bg-lighter-blue-gray p-3 rounded w-full flex flex-col gap-y-2"
                >
                  <p className="text-black-darkest font-bold">{data.title}</p>
                  <p className="text-sm text-gray">Mentor: {data.mentorName}</p>
                  <div className="flex items-center mt-2 gap-x-2">
                    <FormSubmitButton
                      isLoading={inviteResponseMutation.isLoading}
                      type="button"
                      className="w-full"
                      onClick={() => handleAccept(data.roadmapId)}
                    >
                      Accept
                    </FormSubmitButton>
                    <FormSubmitButton
                      isLoading={inviteResponseMutation.isLoading}
                      type="button"
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDecline(data.roadmapId)}
                    >
                      Decline
                    </FormSubmitButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray">
                You currently have no pending roadmap invites. Please check
                again later.
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
