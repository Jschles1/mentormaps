import prismadb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { roadmapId: string; milestoneId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      title,
      description,
      resources,
      subtasks,
      menteeId,
      menteeSolutionComment,
      menteeSolutionUrl,
      decision,
      mentorFeedbackComment,
    } = await req.json();

    const isMentorCompletionReview =
      typeof decision === "string" && typeof mentorFeedbackComment === "string";

    if (isMentorCompletionReview) {
      const associatedRoadmap = await prismadb.roadmap.findFirst({
        where: {
          id: parseInt(params.roadmapId),
          mentorId: userId,
        },
      });

      if (!associatedRoadmap) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const isApproved = decision === "approve";
      const newStatus = isApproved ? "Completed" : "Rejected";
      let notificationMessage = "";

      const reviewedMilestone = await prismadb.milestone.update({
        where: {
          id: parseInt(params.milestoneId),
          roadmapId: associatedRoadmap.id,
        },
        data: {
          status: newStatus,
          mentorFeedbackComment: mentorFeedbackComment,
        },
      });

      if (isApproved) {
        // Get next milestone
        const nextMilestone = await prismadb.milestone.findFirst({
          where: {
            roadmapId: associatedRoadmap.id,
            order: reviewedMilestone.order + 1,
          },
        });

        if (nextMilestone) {
          // If next milestone exists, set it to active
          await prismadb.milestone.update({
            where: {
              id: nextMilestone.id,
            },
            data: {
              status: "Active",
            },
          });

          notificationMessage = `Your mentor has approved your solution for the ${reviewedMilestone.title} milestone!`;
        } else {
          // If next milestone does not exist, set roadmap to completed
          await prismadb.roadmap.update({
            where: {
              id: associatedRoadmap.id,
            },
            data: {
              status: "Completed",
            },
          });

          notificationMessage = `Your mentor has approved your solution for the ${reviewedMilestone.title} milestone! Since it was the last milestone, your roadmap has been set to completed.`;
        }
      } else {
        // If milestone is rejected, set milestone to rejected and send mentee notification
        await prismadb.milestone.update({
          where: {
            id: reviewedMilestone.id,
          },
          data: {
            status: "Rejected",
          },
        });

        notificationMessage = `Your mentor has rejected your solution for the ${reviewedMilestone.title} milestone. Please review their feedback and resubmit your solution.`;
      }

      await prismadb.notification.create({
        data: {
          userId: associatedRoadmap.menteeId,
          message: notificationMessage,
        },
      });

      return NextResponse.json({
        message: notificationMessage,
        approved: isApproved,
      });
    }

    const isMenteeCompletionSubmission =
      typeof menteeSolutionComment === "string" &&
      typeof menteeSolutionUrl === "string";

    if (isMenteeCompletionSubmission) {
      const associatedRoadmap = await prismadb.roadmap.findFirst({
        where: {
          id: parseInt(params.roadmapId),
          menteeId: userId,
        },
      });

      if (!associatedRoadmap) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const markedCompleteMilestone = await prismadb.milestone.update({
        where: {
          id: parseInt(params.milestoneId),
          roadmapId: associatedRoadmap.id,
        },
        data: {
          status: "PendingCompletionReview",
          menteeSolutionComment,
          menteeSolutionUrl,
        },
      });

      const mentorNotification = await prismadb.notification.create({
        data: {
          userId: associatedRoadmap.mentorId,
          message: `Your mentee has submitted a solution for the ${markedCompleteMilestone.title} milestone!`,
        },
      });

      return NextResponse.json({ message: "Success" });
    }

    if (!title || !description) {
      return new NextResponse("Missing title or description", { status: 400 });
    }

    // Store name and URL as one string
    const resourceStrings = resources?.map(
      (resource: { name: string; href: string }) =>
        `${resource.name}___***___${resource.href}`
    );

    const updatedMilestone = await prismadb.milestone.update({
      where: {
        id: parseInt(params.milestoneId),
        roadmapId: parseInt(params.roadmapId),
      },
      data: {
        title,
        description,
        resources: resourceStrings,
        subtasks,
      },
    });

    if (menteeId) {
      await prismadb.notification.create({
        data: {
          userId: menteeId,
          message: `Your mentor updated the ${title} milestone on your roadmap!`,
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
