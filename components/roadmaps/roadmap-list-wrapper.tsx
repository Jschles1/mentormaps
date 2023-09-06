"use client";

import { fetchRoadmaps } from "@/lib/fetchers";
import { Roadmap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import RoadmapList from "./roadmap-list";
import NoRoadmaps from "./no-roadmaps";

interface RoadmapListWrapperProps {
  mentorRoadmaps: Roadmap[];
  menteeRoadmaps: Roadmap[];
  userId: string;
}

export default function RoadmapListWrapper({
  mentorRoadmaps,
  menteeRoadmaps,
  userId,
}: RoadmapListWrapperProps) {
  const roadmapsQueryKey = ["roadmaps", userId];
  const { data } = useQuery({
    queryKey: roadmapsQueryKey,
    queryFn: fetchRoadmaps,
    initialData: { mentorRoadmaps, menteeRoadmaps },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const noRoadmaps =
    !data?.menteeRoadmaps?.length && !data?.mentorRoadmaps?.length;

  if (noRoadmaps) {
    return <NoRoadmaps />;
  }

  return (
    <div>
      <RoadmapList type="mentor" roadmaps={data?.mentorRoadmaps} />
      <RoadmapList type="mentee" roadmaps={data?.menteeRoadmaps} />
    </div>
  );
}
