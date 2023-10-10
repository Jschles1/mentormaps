"use client";

import { Roadmap } from "@prisma/client";
import RoadmapList from "../../roadmaps/roadmap-list/roadmap-list";
import NoRoadmaps from "../../roadmaps/no-roadmaps";
import RoadmapsPageSkeleton from "../../skeletons/roadmaps-page-skeleton";
import useRoadmaps from "@/lib/hooks/useRoadmaps";

interface RoadmapsPageTemplateProps {
  mentorRoadmaps: Roadmap[];
  menteeRoadmaps: Roadmap[];
  userId: string;
}

export default function RoadmapsPageTemplate({
  mentorRoadmaps,
  menteeRoadmaps,
  userId,
}: RoadmapsPageTemplateProps) {
  const roadmapsQueryKey = ["roadmaps", userId];
  const { data, isFetching, isLoading, isInitialLoading, isRefetching } =
    useRoadmaps({
      queryKey: roadmapsQueryKey,
      initialData: {
        mentorRoadmaps: mentorRoadmaps,
        menteeRoadmaps: menteeRoadmaps,
      },
    });

  if (isLoading || isInitialLoading || isFetching || isRefetching) {
    return <RoadmapsPageSkeleton />;
  }

  const noRoadmaps =
    !data?.menteeRoadmaps?.length && !data?.mentorRoadmaps?.length;

  if (noRoadmaps) {
    return <NoRoadmaps />;
  }

  return (
    <div className="lg:flex lg:items-start lg:gap-x-4">
      <RoadmapList type="mentor" roadmaps={data?.mentorRoadmaps} />
      <RoadmapList type="mentee" roadmaps={data?.menteeRoadmaps} />
    </div>
  );
}
