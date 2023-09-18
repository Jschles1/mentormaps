import DesktopUserMenu from "@/components/navigation/desktop-user-menu";
import Logo from "public/images/logo-light.svg";
import { UserButton, auth } from "@clerk/nextjs";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";
import getNotifications from "@/lib/server/api/getNotifications";
import MobileUserMenu from "@/components/navigation/mobile-user-menu";
import AddButton from "@/components/navigation/add-button";
import Image from "next/image";
import NotificationDialog from "@/components/notifications/notification-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const { roadmapInvites, roadmapData } = await getRoadmapInvites(
    userId as string
  );
  const notifications = await getNotifications(userId as string);

  return (
    <div className="h-full w-full min-h-screen flex flex-col bg-lighter-blue-gray relative">
      <div className="h-16 py-5 px-4 bg-white flex items-center justify-between z-49">
        <div className="flex items-center gap-x-4">
          <Image className="block" src={Logo} alt="Roadmap Logo" />
          <h1 className="text-[1.125rem] font-bold">Roadmap</h1>
        </div>

        <div className="flex items-center gap-x-4">
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
          <NotificationDialog notifications={notifications} />
          <MobileUserMenu
            roadmapData={roadmapData}
            roadmapInvites={roadmapInvites}
            userId={userId as string}
          />
        </div>
      </div>
      <div className="flex items-start">
        <DesktopUserMenu
          roadmapData={roadmapData}
          roadmapInvites={roadmapInvites}
          userId={userId as string}
        />
        <main className="h-full w-full px-4 py-6 mx-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
