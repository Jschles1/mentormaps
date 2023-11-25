import { useQuery } from "@tanstack/react-query";
import { fetchRoadmapDetails } from "../fetchers";
import { RoadmapWithMilestonesAndInvites, UserInfo } from "../interfaces";

export default function useRoadmapDetail({
  queryKey,
  roadmapId,
  initialData,
}: {
  queryKey: (string | number | undefined)[];
  roadmapId: number | string;
  initialData: {
    isMentor: boolean;
    otherUser: UserInfo | null;
    currentUser: UserInfo | null;
    roadmap: RoadmapWithMilestonesAndInvites;
  };
}) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchRoadmapDetails(roadmapId.toString()),
    initialData: initialData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
