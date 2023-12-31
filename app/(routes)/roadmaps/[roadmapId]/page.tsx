import { auth } from "@clerk/nextjs";
import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import RoadmapDetailPageTemplate from "@/components/templates/roadmap-detail-page-template";

export default async function RoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const { userId } = auth();
  const { roadmapId } = params;

  const { roadmap, isMentor, otherUser, currentUser } = await getRoadmapDetails(
    roadmapId,
    userId as string
  );

  return (
    <div className="lg:max-w-5xl lg:mx-auto">
      <RoadmapDetailPageTemplate
        roadmapId={roadmapId}
        roadmap={roadmap}
        otherUser={otherUser}
        currentUser={currentUser}
        isMentor={isMentor}
      />
    </div>
  );
}
