import prismadb from "@/lib/prisma-db";

export default async function getNotifications(userId: string) {
  try {
    const notifications = await prismadb.notification.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error: any) {
    throw new Error("Error fetching notifications:", error);
  }
}
