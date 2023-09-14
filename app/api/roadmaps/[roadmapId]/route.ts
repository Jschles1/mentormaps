import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import deleteRoadmap from "@/lib/server/api/deleteRoadmap";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import updateRoadmap from "@/lib/server/api/updateRoadmap";
import prismadb from "@/lib/prisma-db";

export async function GET(
  req: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roadmapDetails = await getRoadmapDetails(params.roadmapId, userId);

    return NextResponse.json(roadmapDetails);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, goal } = await req.json();

    // Basic form validation
    if (!title || !goal) {
      return new NextResponse("Missing title or goal", { status: 400 });
    }

    const updateResult = await updateRoadmap(
      userId,
      parseInt(params.roadmapId),
      title,
      goal
    );

    if (updateResult.menteeId) {
      await prismadb.notification.create({
        data: {
          userId: updateResult.menteeId,
          message: `Your mentor has updated the ${updateResult.title} roadmap!`,
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
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roadmapId = parseInt(params.roadmapId);
    if (!roadmapId) {
      return new NextResponse("Requested roadmap doesn't exist", {
        status: 400,
      });
    }

    const deleteResult = await deleteRoadmap(userId, roadmapId);
    if (deleteResult.menteeId) {
      await prismadb.notification.create({
        data: {
          userId: deleteResult.menteeId,
          message: `Your mentor has deleted the ${deleteResult.title} roadmap!`,
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
