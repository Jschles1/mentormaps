import prismadb from "@/lib/prisma-db";
import { clerkClient } from "@clerk/nextjs";
import { UserInfo } from "@/lib/interfaces";

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
        RoadmapInvite: true,
      },
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const isMentor = roadmap?.mentorId === userId;
    let otherUser: UserInfo | null = null;
    const currentUserDetails = await clerkClient.users.getUser(userId);
    const currentUser = {
      id: userId,
      firstName: currentUserDetails.firstName as string,
      lastName: currentUserDetails.lastName as string,
    };
    let roadmapMilestones = roadmap?.milestones;

    // If user is mentee, remove description, resources, and subtasks from milestones not active or completed
    if (!isMentor) {
      roadmapMilestones = roadmapMilestones?.map((milestone) => {
        if (milestone.status !== "Active" && milestone.status !== "Completed") {
          return {
            ...milestone,
            description: "",
            resources: [],
            subtasks: [],
          };
        } else {
          return milestone;
        }
      });
    }

    if (roadmap?.menteeId) {
      const otherUserId = (
        isMentor ? roadmap?.menteeId : roadmap?.mentorId
      ) as string;
      const otherUserDetails = await clerkClient.users.getUser(otherUserId);
      otherUser = {
        id: otherUserId,
        firstName: otherUserDetails.firstName as string,
        lastName: otherUserDetails.lastName as string,
      };
    }

    return {
      roadmap: { ...roadmap, milestones: roadmapMilestones },
      isMentor,
      otherUser,
      currentUser,
    };
  } catch (error: any) {
    throw new Error("Error fetching Mentee Roadmap Details:", error);
  }
}
