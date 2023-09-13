import deleteNotification from "@/lib/server/api/deleteNotification";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { userId } = auth();

    // Check if user is logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notificationId = parseInt(params.notificationId);
    if (!notificationId) {
      return new NextResponse("Requested notification doesn't exist", {
        status: 400,
      });
    }

    const deleteResult = await deleteNotification(userId, notificationId);

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
