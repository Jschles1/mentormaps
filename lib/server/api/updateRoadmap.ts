import prismadb from "@/lib/prisma-db";

export default async function updateRoadmap(
  userId: string,
  roadmapId: number,
  title: string,
  goal: string
) {
  try {
    const result = await prismadb.roadmap.update({
      where: {
        id: roadmapId,
        mentorId: userId,
      },
      data: {
        title: title,
        goal: goal,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error("Error deleting roadmap :", error);
  }
}
