import { auth } from "@clerk/nextjs";
import getRoadmaps from "@/lib/server/api/getRoadmaps";
import RoadmapListWrapper from "@/components/roadmaps/roadmap-list-wrapper";

export default async function RoadmapsPage() {
  const { userId } = auth();
  const { menteeRoadmaps, mentorRoadmaps } = await getRoadmaps(
    userId as string
  );

  return (
    <RoadmapListWrapper
      userId={userId as string}
      mentorRoadmaps={mentorRoadmaps}
      menteeRoadmaps={menteeRoadmaps}
    />
  );
}
