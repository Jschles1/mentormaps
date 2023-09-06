// "use client";

import Image from "next/image";
import { auth } from "@clerk/nextjs";
import { Mail, Map } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";
import { Roadmap } from "@prisma/client";
import prismadb from "@/lib/prisma-db";
import MenuButton from "./menu-button";
import RoadmapInviteDialog from "../roadmaps/roadmap-invite-dialog";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";
import MenuNotification from "./menu-notification";

interface MobileUserMenuProps {}

export default async function MobileUserMenu({}: MobileUserMenuProps) {
  const { userId } = auth();

  const { roadmapInvites, roadmapData } = await getRoadmapInvites(
    userId as string
  );
  const inviteLength = roadmapInvites?.length;

  // TODO: Show roadmaps that the user is a part of on non-home pages

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-lighter-blue-gray focus:bg-lighter-blue-gray focus-within:bg-lighter-blue-gray focus-visible:bg-lighter-blue-gray active:bg-lighter-blue-gray"
          >
            <Image src={IconVerticalEllipsis} alt="Menu" />
          </Button>
          <MenuNotification
            userId={userId as string}
            roadmapInvites={roadmapInvites}
            roadmapData={roadmapData}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="bg-lighter-blue-gray py-4 pr-4 pl-0">
        {/* TODO: Place in client component and change sheet content based on page */}
        <div className="flex flex-col gap-4">
          <RoadmapInviteDialog
            roadmapInvites={roadmapInvites}
            roadmapData={roadmapData}
            userId={userId as string}
          />

          <MenuButton>
            <div className="flex items-center gap-x-4">
              <Map size={16} /> All Roadmaps
            </div>
          </MenuButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
