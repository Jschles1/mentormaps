import prismadb from "@/lib/prisma-db";

export default async function deleteNotification(
  userId: string,
  notificationId: number
) {
  try {
    const result = await prismadb.notification.delete({
      where: {
        id: notificationId,
        userId: userId,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error("Error deleting notification:", error);
  }
}
