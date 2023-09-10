import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import deleteRoadmap from "@/lib/server/api/deleteRoadmap";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import updateRoadmap from "@/lib/server/api/updateRoadmap";

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
    console.log("REQUEST");
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

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
