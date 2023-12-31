import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prismadb from "@/lib/prisma-db";

interface RoadmapFormData {
  title: string;
  goal: string;
  mentorId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, goal, menteeEmail } = await req.json();

    // Basic form validation
    if (!title || !goal) {
      return new NextResponse("Missing title or goal", { status: 400 });
    }

    const roadmapObject: RoadmapFormData = {
      title,
      goal,
      mentorId: userId,
    };

    let menteeId: string = "";
    let menteeName: string = "";

    // Check if mentee email exists if entered, if so, get menteeId. If not, return error
    if (menteeEmail) {
      const menteeSearchResult = await clerkClient.users.getUserList({
        emailAddress: menteeEmail,
      });

      if (menteeSearchResult.length) {
        menteeId = menteeSearchResult[0].id;
        menteeName = `${menteeSearchResult[0].firstName} ${menteeSearchResult[0].lastName}`;
      } else {
        return new NextResponse("Mentee email doesn't exist", { status: 400 });
      }
    }

    // Create Roadmap
    const newRoadmap = await prismadb.roadmap.create({
      data: roadmapObject,
    });

    // Create RoadmapInvite for mentee if menteeId exists
    if (menteeId) {
      const roadmapInvite = await prismadb.roadmapInvite.create({
        data: {
          roadmapId: newRoadmap.id,
          mentorId: userId,
          menteeId: menteeId,
          menteeName: menteeName,
        },
      });

      const notification = await prismadb.notification.create({
        data: {
          userId: menteeId,
          message: `You've been invited to a new roadmap named ${title}!`,
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
