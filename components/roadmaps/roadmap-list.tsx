import { Roadmap } from "@prisma/client";
import RoadmapCard from "./roadmap-card";
import NoMenteeRoadmaps from "./no-mentee-roadmaps";
import NoMentorRoadmaps from "./no-mentor-roadmaps";
import { RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";

interface RoadmapListProps {
  type: "mentee" | "mentor";
  roadmaps: RoadmapWithMilestonesAndInvites[];
}

export default function RoadmapList({ type, roadmaps }: RoadmapListProps) {
  const roadmapsLength = roadmaps.length;

  if (type === "mentee" && !roadmapsLength) {
    return <NoMenteeRoadmaps />;
  }

  if (type === "mentor" && !roadmapsLength) {
    return <NoMentorRoadmaps />;
  }

  const title =
    (type === "mentee" ? "Mentee Roadmaps" : "Mentor Roadmaps") +
    ` (${roadmapsLength})`;
  return (
    <div className="mb-6 lg:basis-1/2">
      <div className="flex items-center gap-x-2 mb-6">
        <p className="text-xs uppercase text-gray tracking-[2.4px] font-bold">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-y-4">
        {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </div>
  );
}
