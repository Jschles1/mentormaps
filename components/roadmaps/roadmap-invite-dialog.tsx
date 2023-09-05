"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MenuButton from "../navigation/menu-button";
import { Roadmap, RoadmapInvite } from "@prisma/client";
import { Mail } from "lucide-react";
import prismadb from "@/lib/prisma-db";
import { User, clerkClient } from "@clerk/nextjs/server";
import { Button } from "../ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoadmapInvites } from "@/lib/fetchers";

type RoadmapData = {
  roadmapId: number;
  mentorName: string;
  title: string;
};

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
  const queryClient = useQueryClient();
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];
  const { data } = useQuery({
    queryKey: roadmapInvitesQueryKey,
    queryFn: fetchRoadmapInvites,
    initialData: { roadmapInvites, roadmapData },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const inviteLength = data?.roadmapInvites.length;
  const disableInviteButton = !inviteLength;

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
            {data?.roadmapData.map((data: RoadmapData) => (
              <div
                key={data.roadmapId}
                className="bg-lighter-blue-gray p-3 rounded w-full flex flex-col gap-y-2"
              >
                <p className="text-black-darkest font-bold">{data.title}</p>
                <p className="text-sm text-gray">Mentor: {data.mentorName}</p>
                <div className="flex items-center mt-2 gap-x-2">
                  <Button className="w-full">Accept</Button>
                  <Button variant="destructive" className="w-full">
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
