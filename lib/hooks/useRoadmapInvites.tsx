import { useQuery } from "@tanstack/react-query";
import { fetchRoadmapInvites } from "../fetchers";
import { RoadmapData } from "../interfaces";
import { RoadmapInvite } from "@prisma/client";

export default function useRoadmapInvites({
  queryKey,
  initialData,
}: {
  queryKey: (string | number | undefined)[];
  initialData: {
    roadmapInvites: RoadmapInvite[];
    roadmapData: RoadmapData[];
  };
}) {
  return useQuery({
    queryKey: queryKey,
    queryFn: fetchRoadmapInvites,
    initialData: initialData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
