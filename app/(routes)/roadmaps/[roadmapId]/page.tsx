import { auth, clerkClient } from "@clerk/nextjs";
import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";

export default async function RoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const { userId } = auth();
  const { roadmapId } = params;

  const roadmapInfo = await getRoadmapDetails(roadmapId, userId as string);
  console.log({ roadmapInfo });

  return <div>Hello Roadmap {roadmapId}</div>;
}
