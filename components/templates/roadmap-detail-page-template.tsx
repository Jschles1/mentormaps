"use client";

import { fetchRoadmapDetails } from "@/lib/fetchers";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Map,
  Crown,
  GraduationCap,
  BarChart2,
  MilestoneIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserInfo, RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";
import { Button } from "../ui/button";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EditRoadmapDialog from "../roadmaps/edit-roadmap-dialog";
import DeleteRoadmapDialog from "../roadmaps/delete-roadmap-dialog";
import InviteMenteeDialog from "../roadmaps/invite-mentee-dialog";

interface RoadmapDetailPageTemplateProps {
  roadmap: RoadmapWithMilestonesAndInvites;
  isMentor: boolean;
  otherUser: UserInfo | null;
  currentUser: UserInfo | null;
  roadmapId: number | string;
}

export default function RoadmapDetailPageTemplate({
  roadmap,
  isMentor,
  otherUser,
  currentUser,
  roadmapId,
}: RoadmapDetailPageTemplateProps) {
  const roadmapQueryKey = ["roadmap", roadmapId, currentUser?.id];
  const { data } = useQuery({
    queryKey: roadmapQueryKey,
    queryFn: () => fetchRoadmapDetails(roadmapId.toString()),
    initialData: { roadmap, isMentor, otherUser, currentUser },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const hasNoMentee = data?.isMentor && !data?.otherUser;
  const roadmapInvite = data?.roadmap?.RoadmapInvite[0] || null;
  const milestoneLength = data?.roadmap.milestones.length || 0;
  const isRoadmapPending = data?.roadmap.status === "Pending";
  const hasNoMilestones = milestoneLength === 0;
  const invalidRoadmap = hasNoMentee || hasNoMilestones;

  console.log(JSON.stringify(data, null, 2));

  let mentorName: string;
  let menteeName: string;

  if (data?.isMentor) {
    mentorName = `${data?.currentUser?.firstName} ${data?.currentUser?.lastName}`;
    if (hasNoMentee) {
      if (roadmapInvite) {
        menteeName = `${roadmapInvite.menteeName} (Invited)`;
      } else {
        menteeName = "N/A";
      }
    } else {
      menteeName = `${data?.otherUser?.firstName} ${data?.otherUser?.lastName}`;
    }
  } else {
    mentorName = `${data?.otherUser?.firstName} ${data?.otherUser?.lastName}`;
    menteeName = `${data?.currentUser?.firstName} ${data?.currentUser?.lastName}`;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="px-4 py-6 border-0">
        <div className="flex items-center gap-x-4 mb-6 w-full justify-between">
          <div className="flex items-center gap-x-4">
            <Map size={16} />
            <h1 className="text-black-darkest font-bold text-[1.125rem]">
              {data?.roadmap.title}
            </h1>
          </div>

          {data?.isMentor && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-lighter-blue-gray focus:bg-lighter-blue-gray focus-within:bg-lighter-blue-gray focus-visible:bg-lighter-blue-gray active:bg-lighter-blue-gray"
                >
                  <Image src={IconVerticalEllipsis} alt="Roadmap Options" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-y-4">
                <EditRoadmapDialog />
                <DeleteRoadmapDialog />
              </PopoverContent>
            </Popover>
          )}
        </div>
        <p className="text-gray mb-6">{data?.roadmap.goal}</p>
        <div className="flex items-center gap-x-4 mb-3">
          <BarChart2 size={16} />
          <p className="text-black-darkest text-sm">
            Status: {data?.roadmap.status}
          </p>
        </div>
        <div className="flex items-center gap-x-4 mb-3">
          <Crown size={16} />
          <p className="text-black-darkest text-sm">Mentor: {mentorName}</p>
        </div>
        <div className="flex items-center gap-x-4 mb-3">
          <GraduationCap size={16} />
          <p className="text-black-darkest text-sm">Mentee: {menteeName}</p>
        </div>

        {invalidRoadmap && (
          <div className="flex flex-col gap-y-2 mt-6">
            <p className="text-sm text-orange">
              This roadmap cannot be started until the following has been
              completed:
            </p>
            <ul>
              {hasNoMentee && (
                <li className="text-sm text-orange">
                  - A mentee has accepted an invite to this roadmap.
                </li>
              )}
              {hasNoMilestones && (
                <li className="text-sm text-orange">
                  - A Milestone has been added by the roadmap mentor.
                </li>
              )}
            </ul>
          </div>
        )}

        {data?.isMentor && (
          <div className="mt-6 flex flex-col gap-y-4">
            {hasNoMentee && (
              <InviteMenteeDialog
                trigger={
                  <Button variant="secondary" disabled={!!roadmapInvite}>
                    Invite Mentee
                  </Button>
                }
                roadmapId={roadmapId}
              />
            )}
            {isRoadmapPending && (
              <Button disabled={invalidRoadmap}>Begin Roadmap</Button>
            )}
          </div>
        )}
      </Card>

      <Card className="px-4 py-6 border-0">
        <div className="flex items-center gap-x-4 w-full justify-between">
          <div className="flex items-center gap-x-4">
            <MilestoneIcon size={16} />
            <p className="text-black-darkest font-bold text-[1.125rem]">
              Milestones ({milestoneLength})
            </p>
          </div>

          {data?.isMentor && <Button size="sm">Add Milestone</Button>}
        </div>
      </Card>
    </div>
  );
}
