import { auth } from "@clerk/nextjs";
import getRoadmaps from "@/lib/server/api/getRoadmaps";
import RoadmapsPageTemplate from "@/components/templates/roadmaps-page-template/roadmaps-page-template";

export default async function RoadmapsPage() {
  const { userId } = auth();
  const { menteeRoadmaps, mentorRoadmaps } = await getRoadmaps(
    userId as string
  );

  return (
    <RoadmapsPageTemplate
      userId={userId as string}
      mentorRoadmaps={mentorRoadmaps}
      menteeRoadmaps={menteeRoadmaps}
    />
  );
}
