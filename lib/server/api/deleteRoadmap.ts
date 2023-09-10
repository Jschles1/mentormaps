import prismadb from "@/lib/prisma-db";

export default async function deleteRoadmap(userId: string, roadmapId: number) {
  try {
    const result = await prismadb.roadmap.delete({
      where: {
        id: roadmapId,
        mentorId: userId,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error("Error deleting roadmap :", error);
  }
}
