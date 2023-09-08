"use client";

import { fetchRoadmapDetails } from "@/lib/fetchers";
import { Milestone, Roadmap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Map,
  Crown,
  GraduationCap,
  BarChart2,
  MilestoneIcon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserInfo, RoadmapWithMilestones } from "@/lib/interfaces";
import { Button } from "../ui/button";

interface RoadmapDetailPageTemplateProps {
  roadmap: RoadmapWithMilestones;
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
  const roadmapQueryKey = ["roadmap", roadmapId];
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
        <div className="flex items-center gap-x-4 mb-6">
          <div className="flex items-center gap-x-4">
            <Map size={16} />
            <h1 className="text-black-darkest font-bold text-[1.125rem]">
              {data?.roadmap.title}
            </h1>
          </div>
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
                  - A Milestone has been added.
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-y-4">
          {/* TODO: Turn into dialog */}
          {hasNoMentee && <Button variant="secondary">Invite Mentee</Button>}
          <Button disabled={invalidRoadmap}>Begin Roadmap</Button>
          {/* <Button variant="secondary">Edit Roadmap Details</Button>
          <Button variant="destructive">Delete Roadmap</Button> */}
        </div>
      </Card>

      <Card className="px-4 py-6 border-0">
        <div className="flex items-center gap-x-4 w-full justify-between">
          <div className="flex items-center gap-x-4">
            <MilestoneIcon size={16} />
            <p className="text-black-darkest font-bold text-[1.125rem]">
              Milestones ({milestoneLength})
            </p>
          </div>

          <Button size="sm">Add Milestone</Button>
        </div>
      </Card>
    </div>
  );
}
