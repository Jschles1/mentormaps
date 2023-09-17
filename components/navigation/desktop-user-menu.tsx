"use client";

import { RoadmapInvite, Notification } from "@prisma/client";
import NotificationDialog from "../notifications/notification-dialog";
import RoadmapInviteDialog from "../roadmaps/roadmap-invite-dialog";
import { RoadmapData } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications, fetchRoadmapInvites } from "@/lib/fetchers";
import Link from "next/link";
import MenuButton from "./menu-button";
import { Map } from "lucide-react";

interface DesktopUserMenuProps {
  roadmapInvites: RoadmapInvite[];
  roadmapData: RoadmapData[];
  userId: string;
  notifications: Notification[];
}

export default function DesktopUserMenu({
  roadmapData,
  roadmapInvites,
  userId,
  notifications,
}: DesktopUserMenuProps) {
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];
  const notificationsQueryKey = ["notifications", userId];

  const { data } = useQuery({
    queryKey: roadmapInvitesQueryKey,
    queryFn: fetchRoadmapInvites,
    initialData: { roadmapInvites, roadmapData },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: notificationsData } = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    initialData: notifications,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <div className="bg-white py-4 pr-4 pl-0 hidden lg:block h-[calc(100vh-4rem)] w-[24rem] border-lighter-blue-gray border border-l-0 border-b-0">
      <div className="flex flex-col gap-4">
        {/* TODO: Move out of user dialog? */}
        <NotificationDialog notifications={notificationsData} />

        <RoadmapInviteDialog
          roadmapInvites={data?.roadmapInvites}
          roadmapData={data?.roadmapData}
          userId={userId as string}
        />

        <Link href="/roadmaps">
          <MenuButton>
            <div className="flex items-center gap-x-4">
              <Map size={16} /> All Roadmaps
            </div>
          </MenuButton>
        </Link>
      </div>
    </div>
  );
}
