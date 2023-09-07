import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

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
