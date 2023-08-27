// "use client";

import { useParams, useSearchParams } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Logo from "public/images/logo-light.svg";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";

import prismadb from "@/lib/prisma-db";
import MobileRoadmapDropdownMenu from "./mobile-roadmap-dropdown-menu";
import AddButton from "./add-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";

export default async function Navigation() {
  const { userId } = auth();
  const user = await currentUser();
  // const roadmaps = await prismadb.roadmap.findMany({
  //   where: {
  //     menteeId: userId,
  //   },
  // });

  console.log(userId);
  console.log({ user });
  // console.log({ roadmaps });

  return (
    <div className="h-16 py-5 px-4 bg-white flex items-center justify-between z-49">
      <div className="flex items-center gap-x-4">
        <Image className="block" src={Logo} alt="Roadmap Logo" />
        <h1 className="text-[1.125rem] font-bold">Roadmap</h1>
      </div>

      <div className="flex items-center">
        <AddButton />

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="ml-4" variant="ghost" size="icon">
                <Image src={IconVerticalEllipsis} alt="Menu" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-lighter-blue-gray">
              <SheetHeader>
                <SheetTitle>Main Menu</SheetTitle>
                <SheetDescription>Description</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">Hello</div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
