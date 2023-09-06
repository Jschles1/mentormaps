import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";
import { Button } from "@/components/ui/button";
import NoRoadmaps from "@/components/roadmaps/no-roadmaps";
import RoadmapsList from "@/components/roadmaps/roadmap-list";
import getRoadmaps from "@/lib/server/api/getRoadmaps";

export default async function RoadmapsPage() {
  const { userId } = auth();
  const { menteeRoadmaps, mentorRoadmaps } = await getRoadmaps(
    userId as string
  );
  const noRoadmaps = !menteeRoadmaps?.length && !mentorRoadmaps?.length;

  console.log({ menteeRoadmaps, mentorRoadmaps });

  if (noRoadmaps) {
    return <NoRoadmaps />;
  }

  return (
    <div>
      <RoadmapsList type="mentor" roadmaps={mentorRoadmaps} />
      <RoadmapsList type="mentee" roadmaps={menteeRoadmaps} />
    </div>
  );
}
