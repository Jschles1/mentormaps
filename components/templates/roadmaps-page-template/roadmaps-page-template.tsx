"use client";

import { Roadmap } from "@prisma/client";
import RoadmapList from "../../roadmaps/roadmap-list/roadmap-list";
import RoadmapsPageSkeleton from "../../skeletons/roadmaps-page-skeleton";
import useRoadmaps from "@/lib/hooks/useRoadmaps";
import CreateRoadMapDialog from "@/components/roadmaps/create-roadmap-dialog";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center flex flex-col items-center gap-4 text-gray font-bold text-lg">
          <p className="text-gray">
            You currently do not own or belong to any roadmaps.
          </p>
          <p>
            To join a roadmap as a mentee, you must receive a roadmap invite
            from your mentor. Check &quot;Roadmap Invites&quot; in the menu to
            see pending invites.
          </p>
          <p className="mb-6">
            To create a roadmap as a mentor, click the &quot;+&quot; button
            above or the &quot;Add New Roadmap&quot; button below to get
            started.
          </p>
          <CreateRoadMapDialog
            trigger={
              <Button className="inline-flex items-center justify-center h-12 px-[1.125rem] py-4 text-[0.938rem] lg:text-base bg-dark-lavender focus-within:bg-light-lavender focus:bg-light-lavender active:bg-light-lavender hover:bg-light-lavender text-white rounded-3xl">
                + Add New Roadmap
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex lg:items-start lg:gap-x-4">
      <RoadmapList type="mentor" roadmaps={data?.mentorRoadmaps} />
      <RoadmapList type="mentee" roadmaps={data?.menteeRoadmaps} />
    </div>
  );
}
