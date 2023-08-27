import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";
import { Button } from "@/components/ui/button";
import NoRoadmaps from "@/components/roadmaps/no-roadmaps";

export default async function RoadmapsPage() {
  const { userId } = auth();
  const menteeRoadmaps = await prismadb.roadmap.findMany({
    where: {
      menteeId: userId,
    },
  });
  const mentorRoadmaps = await prismadb.roadmap.findMany({
    where: {
      mentorId: userId,
    },
  });
  const noRoadmaps = !menteeRoadmaps?.length && !mentorRoadmaps?.length;

  if (noRoadmaps) {
    return <NoRoadmaps />;
  }

  return <div>Hello Roadmap (Roadmaps Page)</div>;
}
