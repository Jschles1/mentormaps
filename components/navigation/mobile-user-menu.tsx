"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Map } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import IconVerticalEllipsis from "/public/images/icon-vertical-ellipsis.svg";
import MenuButton from "./menu-button";
import RoadmapInviteDialog from "../roadmaps/roadmap-invite-dialog";
import { RoadmapInvite } from "@prisma/client";
import { RoadmapData } from "@/lib/interfaces";
import useRoadmapInvites from "@/lib/hooks/useRoadmapInvites";

interface MobileUserMenuProps {
  roadmapInvites: RoadmapInvite[];
  roadmapData: RoadmapData[];
  userId: string;
}

export default function MobileUserMenu({
  roadmapData,
  roadmapInvites,
  userId,
}: MobileUserMenuProps) {
  // TODO: Show roadmaps that the user is a part of on non-home pages
  const [open, setOpen] = React.useState(false);
  const roadmapInvitesQueryKey = ["roadmapInvites", userId];
  const { data } = useRoadmapInvites({
    queryKey: roadmapInvitesQueryKey,
    initialData: { roadmapInvites, roadmapData },
  });

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
    },
    [setOpen]
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-lighter-blue-gray focus:bg-lighter-blue-gray focus-within:bg-lighter-blue-gray focus-visible:bg-lighter-blue-gray active:bg-lighter-blue-gray lg:hidden"
          >
            <Image src={IconVerticalEllipsis} alt="Menu" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="bg-lighter-blue-gray py-4 pr-4 pl-0">
        <div className="flex flex-col gap-4">
          <Link href="/roadmaps" onClick={handleClose}>
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
      </SheetContent>
    </Sheet>
  );
}
