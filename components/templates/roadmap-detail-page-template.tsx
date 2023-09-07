"use client";

import { fetchRoadmapDetails } from "@/lib/fetchers";
import { Milestone, Roadmap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
}

interface RoadmapWithMilestones extends Roadmap {
  milestones: Milestone[];
}

interface RoadmapDetailPageTemplateProps {
  roadmap: RoadmapWithMilestones;
  isMentor: boolean;
  otherUser: UserInfo | null;
  roadmapId: number | string;
}

export default function RoadmapDetailPageTemplate({
  roadmap,
  isMentor,
  otherUser,
  roadmapId,
}: RoadmapDetailPageTemplateProps) {
  const roadmapQueryKey = ["roadmap", roadmapId];
  const { data } = useQuery({
    queryKey: roadmapQueryKey,
    queryFn: () => fetchRoadmapDetails(roadmapId.toString()),
    initialData: { roadmap, isMentor, otherUser },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  console.log(JSON.stringify(data, null, 2));

  return <div></div>;
}
