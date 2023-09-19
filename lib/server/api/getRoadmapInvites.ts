import prismadb from "@/lib/prisma-db";
import { clerkClient } from "@clerk/nextjs";
import { Roadmap } from "@prisma/client";
import { RoadmapInviteData } from "@/lib/interfaces";

export default async function getRoadmapInvites(userId: string) {
  console.log({ userId });
  try {
    const roadmapInvites = await prismadb.roadmapInvite.findMany({
      where: {
        menteeId: userId,
      },
    });

    console.log({ roadmapInvites });

    const invitedRoadmapDataPromises = await roadmapInvites.map(
      async (invite): Promise<RoadmapInviteData> => {
        const roadmap = (await prismadb.roadmap.findUnique({
          where: {
            id: invite.roadmapId as number,
          },
        })) as Roadmap;
        const mentor = await clerkClient.users.getUser(
          roadmap?.mentorId as string
        );
        return { roadmap, mentor };
      }
    );

    console.log({ invitedRoadmapDataPromises });

    const results = await Promise.allSettled(invitedRoadmapDataPromises);

    console.log({ results });
    const invitedRoadmapData = results
      .filter(
        (result): result is PromiseFulfilledResult<RoadmapInviteData> =>
          result.status === "fulfilled"
      )
      .map((result) => ({
        roadmapId: result.value.roadmap.id,
        title: result.value.roadmap.title,
        mentorName: `${result.value.mentor.firstName} ${result.value.mentor.lastName}`,
      }));

    console.log({ invitedRoadmapData });

    return { roadmapInvites, roadmapData: invitedRoadmapData };
  } catch (error: any) {
    throw new Error("Error fetching Roadmap Invites :", error);
  }
}
