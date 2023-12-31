"use client";

import { RoadmapInvite } from "@prisma/client";
import RoadmapInviteDialog from "../roadmaps/roadmap-invite-dialog";
import { RoadmapData } from "@/lib/interfaces";
import Link from "next/link";
import MenuButton from "./menu-button";
import { Map } from "lucide-react";
import useRoadmapInvites from "@/lib/hooks/useRoadmapInvites";

interface DesktopUserMenuProps {
  roadmapInvites: RoadmapInvite[];
  roadmapData: RoadmapData[];
  userId: string;
}

export default function DesktopUserMenu({
  roadmapData,
  roadmapInvites,
  userId,
}: DesktopUserMenuProps) {
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];

  const { data } = useRoadmapInvites({
    queryKey: roadmapInvitesQueryKey,
    initialData: { roadmapInvites, roadmapData },
  });

  return (
    <div className="bg-white py-4 pr-4 pl-0 hidden lg:block min-h-[calc(100vh-4rem)] h-full w-[24rem] border-lighter-blue-gray border border-l-0 border-b-0">
      <div className="flex flex-col gap-4">
        <Link href="/roadmaps">
          <MenuButton>
            <div className="flex items-center gap-x-4">
              <Map size={16} /> All Roadmaps
            </div>
          </MenuButton>
        </Link>
        <RoadmapInviteDialog
          roadmapInvites={data?.roadmapInvites}
          roadmapData={data?.roadmapData}
          userId={userId as string}
        />
      </div>
    </div>
  );
}
