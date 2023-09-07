import { auth, clerkClient } from "@clerk/nextjs";
import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import RoadmapDetailPageTemplate from "@/components/templates/roadmap-detail-page-template";

export default async function RoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const { userId } = auth();
  const { roadmapId } = params;

  const { roadmap, isMentor, otherUser } = await getRoadmapDetails(
    roadmapId,
    userId as string
  );

  return (
    <div>
      <RoadmapDetailPageTemplate
        roadmapId={roadmapId}
        roadmap={roadmap}
        otherUser={otherUser}
        isMentor={isMentor}
      />
    </div>
  );
}
