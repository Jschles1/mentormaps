"use client";

import { fetchRoadmapDetails } from "@/lib/fetchers";
import { Milestone, Roadmap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Map, Crown, GraduationCap, BarChart2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
}

interface RoadmapWithMilestones extends Roadmap {
  milestones: Milestone[];
}

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

  console.log(JSON.stringify(data, null, 2));
  let mentorName: string;
  let menteeName: string;
  if (data?.isMentor) {
    mentorName = `${data?.currentUser?.firstName} ${data?.currentUser?.lastName}`;
    if (hasNoMentee) {
      menteeName = "N/A";
    } else {
      menteeName = `${data?.otherUser?.firstName} ${data?.otherUser?.lastName}`;
    }
  } else {
    mentorName = `${data?.otherUser?.firstName} ${data?.otherUser?.lastName}`;
    menteeName = `${data?.currentUser?.firstName} ${data?.currentUser?.lastName}`;
  }

  return (
    <div>
      <Card className="px-4 py-6 border-0">
        <div className="flex items-center gap-x-4 mb-6">
          <Map size={16} />
          <h1 className="text-black-darkest font-bold text-[1.125rem]">
            {data?.roadmap.title}
          </h1>
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
      </Card>
    </div>
  );
}
