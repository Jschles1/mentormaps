// "use client";

import { UserButton, auth } from "@clerk/nextjs";
import Image from "next/image";
import Logo from "public/images/logo-light.svg";

import prismadb from "@/lib/prisma-db";
import AddButton from "./add-button";
import MobileUserMenu from "./mobile-user-menu";

export default async function Navigation() {
  const { userId } = auth();
  const roadmaps = await prismadb.roadmap.findMany({
    where: {
      menteeId: userId,
    },
  });

  return (
    <div className="h-16 py-5 px-4 bg-white flex items-center justify-between z-49">
      <div className="flex items-center gap-x-4">
        <Image className="block" src={Logo} alt="Roadmap Logo" />
        <h1 className="text-[1.125rem] font-bold">Roadmap</h1>
      </div>

      <div className="flex items-center gap-x-4 md:hidden">
        <AddButton />
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonPopoverCard: "mx-auto !top-20 right-0 rounded-lg",
            },
          }}
          userProfileMode="modal"
        />
        <MobileUserMenu roadmaps={roadmaps} />
      </div>
    </div>
  );
}