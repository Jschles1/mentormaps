import getRoadmaps from "@/lib/server/api/getRoadmaps";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roadmaps = await getRoadmaps(userId);

    return NextResponse.json(roadmaps);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
