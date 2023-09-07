import prismadb from "@/lib/prisma-db";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

export default async function getRoadmapDetails(
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
      include: {
        milestones: true,
      },
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const isMentor = roadmap?.mentorId === userId;
    let otherUser: User | null = null;

    if (roadmap?.menteeId) {
      const otherUserId = (
        isMentor ? roadmap?.menteeId : roadmap?.mentorId
      ) as string;
      otherUser = await clerkClient.users.getUser(otherUserId);
    }

    return { roadmap, isMentor, otherUser };
  } catch (error: any) {
    throw new Error("Error fetching Mentee Roadmap :", error);
  }
}
