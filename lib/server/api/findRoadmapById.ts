import prismadb from "@/lib/prisma-db";

export default async function findRoadmapById(
  roadmapId: string,
  userId: string
) {
  try {
    const roadmap = await prismadb.roadmap.findFirst({
      where: {
        OR: [
          {
            menteeId: userId,
            id: parseInt(roadmapId),
          },
          {
            mentorId: userId,
            id: parseInt(roadmapId),
          },
        ],
      },
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    return roadmap;
  } catch (error: any) {
    throw new Error("Error fetching Mentee Roadmap :", error);
  }
}
