import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prismadb from "@/lib/prisma-db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { menteeEmail, roadmapId } = await req.json();

    if (!menteeEmail || !roadmapId) {
      return new NextResponse("Missing menteeEmail or roadmapId", {
        status: 400,
      });
    }

    const menteeSearchResult = await clerkClient.users.getUserList({
      emailAddress: menteeEmail,
    });

    if (menteeSearchResult.length) {
      const roadmapInvite = await prismadb.roadmapInvite.findFirst({
        where: {
          roadmapId: parseInt(roadmapId),
          menteeId: menteeSearchResult[0].id,
        },
      });

      // Check if roadmapInvite exists
      if (roadmapInvite) {
        return new NextResponse("Mentee has already been invited", {
          status: 400,
        });
      }

      // Create RoadmapInvite for mentee if menteeId exists
      await prismadb.roadmapInvite.create({
        data: {
          roadmapId: parseInt(roadmapId),
          mentorId: userId,
          menteeName: `${menteeSearchResult[0].firstName} ${menteeSearchResult[0].lastName}`,
          menteeId: menteeSearchResult[0].id,
        },
      });

      await prismadb.notification.create({
        data: {
          userId: menteeSearchResult[0].id,
          message: `You've been invited to a new roadmap!`,
        },
      });

      return NextResponse.json({ message: "Success" });
    } else {
      return new NextResponse("Mentee email doesn't exist", { status: 400 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
