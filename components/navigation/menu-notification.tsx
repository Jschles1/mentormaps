"use client";

import { fetchRoadmapInvites } from "@/lib/fetchers";
import { RoadmapInvite } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { RoadmapData } from "@/lib/interfaces";

interface MenuNotificationProps {
  roadmapInvites: RoadmapInvite[];
  roadmapData: RoadmapData[];
  userId: string;
}

export default function MenuNotification({
  roadmapInvites,
  roadmapData,
  userId,
}: MenuNotificationProps) {
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];
  const { data } = useQuery({
    queryKey: roadmapInvitesQueryKey,
    queryFn: fetchRoadmapInvites,
    initialData: { roadmapInvites, roadmapData },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const length = data?.roadmapInvites.length;

  if (length) {
    return (
      <div className="absolute text-xs bg-dark-lavender text-white -top-1 -right-1 px-[0.375rem] rounded-full">
        {length}
      </div>
    );
  }

  return null;
}
