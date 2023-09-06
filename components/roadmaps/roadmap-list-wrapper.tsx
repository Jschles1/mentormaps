"use client";

import { fetchRoadmaps } from "@/lib/fetchers";
import { Roadmap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import RoadmapsList from "./roadmap-list";

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

  console.log({ data });

  return (
    <div>
      <RoadmapsList type="mentor" roadmaps={data?.mentorRoadmaps} />
      <RoadmapsList type="mentee" roadmaps={data?.menteeRoadmaps} />
    </div>
  );
}
