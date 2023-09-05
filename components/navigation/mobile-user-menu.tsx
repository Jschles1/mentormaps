// "use client";

import Image from "next/image";
import { auth } from "@clerk/nextjs";
import { Mail, Map } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";
import { Roadmap } from "@prisma/client";
import prismadb from "@/lib/prisma-db";

interface MobileUserMenuProps {
  roadmaps: Roadmap[];
}

function MenuButton({
  children,
  disabled,
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<
  typeof Button
>) {
  return (
    <Button
      disabled={disabled}
      variant="ghost"
      className="text-gray text-[0.938rem] disabled:bg-white disabled:text-gray bg-white rounded-tl-none rounded-bl-none rounded-tr-[100px] rounded-br-[100px] w-full justify-start hover:text-white focus:text-white focus-within:text-white focus:bg-dark-lavender active:text-white active:bg-dark-lavender"
    >
      {children}
    </Button>
  );
}

export default async function MobileUserMenu({
  roadmaps,
}: MobileUserMenuProps) {
  const { userId } = auth();

  const roadmapInvites = await prismadb.roadmapInvite.findMany({
    where: {
      menteeId: userId,
    },
  });
  const inviteLength = roadmapInvites?.length;
  const disableInviteButton = !inviteLength;

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
          {!!inviteLength && (
            <div className="absolute text-xs bg-dark-lavender text-white -top-1 -right-1 px-[0.375rem] rounded-full">
              {inviteLength}
            </div>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="bg-lighter-blue-gray py-4 pr-4 pl-0">
        {/* TODO: Place in client component and change sheet content based on page */}
        <div className="flex flex-col gap-4">
          <MenuButton disabled={disableInviteButton}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-4">
                <Mail size={16} /> Roadmap Invites
              </div>
              <div>{inviteLength}</div>
            </div>
          </MenuButton>
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
