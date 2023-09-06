import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";
import prismadb from "@/lib/prisma-db";

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

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { accepted, roadmapId } = await req.json();
    const roadmapInvite = await prismadb.roadmapInvite.findFirst({
      where: {
        roadmapId: roadmapId,
        menteeId: userId,
      },
    });

    // Check if roadmapInvite exists
    if (!roadmapInvite) {
      return new NextResponse("Roadmap invite doesn't exist", {
        status: 400,
      });
    }

    // If accepted:
    // find roadmap by id using roadmapId
    // Update roadmap.menteeId to userId
    if (accepted) {
      await prismadb.roadmap.update({
        where: {
          id: roadmapId,
        },
        data: {
          menteeId: userId,
        },
      });
    }

    // Delete roadmapInvite
    await prismadb.roadmapInvite.delete({
      where: {
        id: roadmapInvite.id,
      },
    });

    return NextResponse.json({ accepted: accepted, roadmapId: roadmapId });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
