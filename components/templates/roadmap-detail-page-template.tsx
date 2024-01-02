"use client";

import * as React from "react";
import { Milestone } from "@prisma/client";
import Image from "next/image";
import { Map, MilestoneIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserInfo, RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";
import { Button } from "../ui/button";
import IconVerticalEllipsis from "/public/images/icon-vertical-ellipsis.svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EditRoadmapDialog from "../roadmaps/edit-roadmap-dialog";
import DeleteRoadmapDialog from "../roadmaps/delete-roadmap-dialog";
import InviteMenteeDialog from "../roadmaps/invite-mentee-dialog";
import MilestoneCard from "../milestones/milestone-card";
import BeginRoadmapDialog from "../roadmaps/begin-roadmap-dialog";
import { cn, roadmapStatusTextClass } from "@/lib/utils";
import RoadmapDetailPageSkeleton from "../skeletons/roadmap-detail-page-skeleton";
import MilestoneFormDialog from "../milestones/milestone-form-dialog";
import useRoadmapDetail from "@/lib/hooks/useRoadmapDetail";

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
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const { data, isLoading, isFetching, isRefetching, isInitialLoading } =
    useRoadmapDetail({
      queryKey: roadmapQueryKey,
      roadmapId: roadmapId,
      initialData: {
        isMentor: isMentor,
        otherUser: otherUser,
        currentUser: currentUser,
        roadmap: roadmap,
      },
    });

  function handlePopoverOpenChange(open: boolean) {
    setIsPopoverOpen(open);
  }

  if (isLoading || isInitialLoading || isFetching || isRefetching) {
    return <RoadmapDetailPageSkeleton />;
  }

  const hasNoMentee = data?.isMentor && !data?.otherUser;
  const roadmapInvite = data?.roadmap?.RoadmapInvite[0] || null;
  const milestoneLength = data?.roadmap.milestones.length || 0;
  const isRoadmapPending = data?.roadmap.status === "Pending";
  const hasNoMilestones = milestoneLength === 0;
  const invalidRoadmap = hasNoMentee || hasNoMilestones;

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
            <Popover
              open={isPopoverOpen}
              onOpenChange={handlePopoverOpenChange}
            >
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
                <EditRoadmapDialog
                  closePopover={() => setIsPopoverOpen(false)}
                  title={data?.roadmap.title}
                  goal={data?.roadmap.goal}
                />
                <DeleteRoadmapDialog />
              </PopoverContent>
            </Popover>
          )}
        </div>
        <p className="text-gray mb-6">{data?.roadmap.goal}</p>
        <div className="mb-3">
          <p className="text-xs text-gray">Status</p>
          <p
            className={cn(
              "text-sm text-black-darkest font-bold",
              roadmapStatusTextClass(data?.roadmap.status)
            )}
          >
            {data?.roadmap.status}
          </p>
        </div>
        <div className="mb-3">
          <p className="text-xs text-gray">Mentor</p>
          <p className="text-sm text-black-darkest font-bold">{mentorName}</p>
        </div>
        <div className="mb-3">
          <p className="text-xs text-gray">Mentee</p>
          <p className="text-sm text-black-darkest font-bold">{menteeName}</p>
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
          <div className="mt-6 flex flex-col gap-y-4 md:flex-row md:gap-x-4">
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
              <BeginRoadmapDialog
                trigger={
                  <Button disabled={invalidRoadmap}>Begin Roadmap</Button>
                }
              />
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

          {data?.isMentor && (
            <MilestoneFormDialog
              type="create"
              trigger={<Button size="sm">Add Milestone</Button>}
              menteeId={data?.otherUser?.id}
            />
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-y-4 relative">
        {data?.roadmap.milestones.map((milestone: Milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            isMentor={isMentor}
          />
        ))}
        <div
          className="border-light-blue-gray border-l-8 h-full text-transparent absolute left-5 animate-pulse"
          aria-hidden
        ></div>
      </div>
    </div>
  );
}
