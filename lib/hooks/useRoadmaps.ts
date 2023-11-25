import { useQuery } from "@tanstack/react-query";
import { fetchRoadmaps } from "../fetchers";
import { Roadmap } from "@prisma/client";

export default function useRoadmaps({
  queryKey,
  initialData,
}: {
  queryKey: (string | number | undefined)[];
  initialData: {
    mentorRoadmaps: Roadmap[];
    menteeRoadmaps: Roadmap[];
  };
}) {
  return useQuery({
    queryKey: queryKey,
    queryFn: fetchRoadmaps,
    initialData: initialData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
