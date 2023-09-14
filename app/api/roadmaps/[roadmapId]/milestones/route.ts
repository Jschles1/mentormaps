import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";

export async function POST(
  req: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, resources, subtasks, menteeId } =
      await req.json();

    // Basic form validation
    if (!title || !description) {
      return new NextResponse("Missing title or description", { status: 400 });
    }

    const existingMilestones = await prismadb.milestone.findMany({
      where: {
        roadmapId: parseInt(params.roadmapId),
      },
    });

    // If we allow users to set custom order, need to subsequently update order of all milestones

    const newMilestoneOrder = existingMilestones.length + 1;

    // Store name and URL as one string
    const resourceStrings = resources?.map(
      (resource: { name: string; href: string }) =>
        `${resource.name}___***___${resource.href}`
    );

    const newMilestone = await prismadb.milestone.create({
      data: {
        title,
        description,
        resources: resourceStrings,
        subtasks,
        order: newMilestoneOrder,
        roadmapId: parseInt(params.roadmapId),
      },
    });

    if (menteeId) {
      await prismadb.notification.create({
        data: {
          userId: menteeId,
          message: `Your mentor has added a new milestone ${title} to your roadmap!`,
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log({ error });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
