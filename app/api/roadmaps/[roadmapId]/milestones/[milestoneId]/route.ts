import prismadb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roadmapId: string; milestoneId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roadmapId = parseInt(params.roadmapId);
    const milestoneId = parseInt(params.milestoneId);

    if (!roadmapId || !milestoneId) {
      return new NextResponse("Missing milestone ID or roadmap ID", {
        status: 400,
      });
    }

    const roadmap = await prismadb.roadmap.findFirst({
      where: {
        id: roadmapId,
        mentorId: userId,
      },
      include: {
        milestones: true,
      },
    });

    if (!roadmap) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const milestoneToDelete = await prismadb.milestone.findFirst({
      where: {
        id: milestoneId,
        roadmapId: roadmap.id,
      },
    });

    if (!milestoneToDelete) {
      return new NextResponse("Milestone does not exist", { status: 400 });
    }

    const currentMilestones = roadmap.milestones;

    const deleteResult = await prismadb.milestone.delete({
      where: {
        id: milestoneToDelete.id,
      },
    });

    if (currentMilestones.length === 1 && roadmap.status === "Active") {
      await prismadb.roadmap.update({
        where: {
          id: roadmap.id,
        },
        data: {
          status: "Pending",
        },
      });

      // Send notification to mentee
      await prismadb.notification.create({
        data: {
          userId: roadmap.menteeId,
          message: `Your mentor has deleted the ${deleteResult.title} milestone. Since it was the only milestone, the roadmap has been set to pending.`,
        },
      });
    } else {
      for (let i = 0; i < currentMilestones.length; i++) {
        console.log({ i });
        // Lower order of each milestone after the deleted milestone by 1
        if (currentMilestones[i].order > milestoneToDelete.order) {
          const newMilestoneData: Prisma.MilestoneUpdateInput = {
            order: currentMilestones[i].order - 1,
          };
          // If deleted milestone was active, set next milestone to active
          if (milestoneToDelete.status === "Active") {
            newMilestoneData.status = "Active";
          }
          await prismadb.milestone.update({
            where: {
              id: currentMilestones[i].id,
            },
            data: newMilestoneData,
          });
        }
      }

      // Send notification to mentee
      await prismadb.notification.create({
        data: {
          userId: roadmap.menteeId,
          message: `Your mentor has deleted the ${deleteResult.title} milestone. The order of the remaining milestones has been updated.`,
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
