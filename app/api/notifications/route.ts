import getNotifications from "@/lib/server/api/getNotifications";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await getNotifications(userId);

    return NextResponse.json(notifications);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
