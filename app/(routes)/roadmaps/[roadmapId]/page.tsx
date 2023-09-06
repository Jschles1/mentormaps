import { auth } from "@clerk/nextjs";
import findRoadmapById from "@/lib/server/api/findRoadmapById";

export default async function RoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const { userId } = auth();
  const { roadmapId } = params;

  const roadmap = await findRoadmapById(roadmapId, userId as string);
  const isMentor = roadmap?.mentorId === userId;
  const isMentee = roadmap?.menteeId === userId;
  return <div>Hello Roadmap {roadmapId}</div>;
}
