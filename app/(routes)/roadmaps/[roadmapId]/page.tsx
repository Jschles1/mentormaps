import { auth, clerkClient } from "@clerk/nextjs";
import fetchRoadmapDetails from "@/lib/server/api/fetchRoadmapDetails";

export default async function RoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const { userId } = auth();
  const { roadmapId } = params;

  const roadmapInfo = await fetchRoadmapDetails(roadmapId, userId as string);
  console.log({ roadmapInfo });

  return <div>Hello Roadmap {roadmapId}</div>;
}
