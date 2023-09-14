import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";

export async function POST(
  req: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { userId } = auth();
    const roadmapId = parseInt(params.roadmapId);

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      return new NextResponse("Roadmap does not exist", { status: 401 });
    }

    if (roadmap?.status === "Active") {
      return new NextResponse("Roadmap is already active", { status: 400 });
    }

    if (!roadmap?.menteeId) {
      return new NextResponse("Roadmap cannot be started without mentee", {
        status: 400,
      });
    }

    if (roadmap?.milestones?.length === 0) {
      return new NextResponse("Roadmap cannot be started without milestones", {
        status: 400,
      });
    }

    const updatedRoadmap = await prismadb.roadmap.update({
      where: {
        id: roadmapId,
        mentorId: userId,
      },
      data: {
        status: "Active",
      },
    });

    await prismadb.notification.create({
      data: {
        userId: updatedRoadmap.menteeId,
        message: `Your mentor has started the ${updatedRoadmap.title} roadmap!`,
      },
    });

    // Get milestones for roadmap, then set first milestone to active
    const milestones = await prismadb.milestone.findMany({
      where: {
        roadmapId,
      },
      orderBy: {
        order: "asc",
      },
    });

    const firstMilestoneId = milestones[0].id;
    const updatedMilestone = await prismadb.milestone.update({
      where: {
        id: firstMilestoneId,
      },
      data: {
        status: "Active",
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
