import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roadmapInvites = await getRoadmapInvites(userId);

    return NextResponse.json(roadmapInvites);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
