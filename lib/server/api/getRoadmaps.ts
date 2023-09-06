import prismadb from "@/lib/prisma-db";

export default async function getRoadmaps(userId: string) {
  try {
    const menteeRoadmaps = await prismadb.roadmap.findMany({
      where: {
        menteeId: userId,
      },
    });
    const mentorRoadmaps = await prismadb.roadmap.findMany({
      where: {
        mentorId: userId,
      },
    });

    return { menteeRoadmaps, mentorRoadmaps };
  } catch (error: any) {
    throw new Error("Error fetching Roadmaps :", error);
  }
}
