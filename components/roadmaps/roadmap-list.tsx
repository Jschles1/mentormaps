import { Roadmap } from "@prisma/client";
import RoadmapCard from "./roadmap-card";
import NoMenteeRoadmaps from "./no-mentee-roadmaps";
import NoMentorRoadmaps from "./no-mentor-roadmaps";

interface RoadmapListProps {
  type: "mentee" | "mentor";
  roadmaps: Roadmap[];
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
    <div className="mb-6">
      <div className="flex items-center gap-x-2 mb-6">
        <p className="text-xs uppercase text-gray tracking-[2.4px] font-bold">
          {title}
        </p>
      </div>
      <div>
        {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </div>
  );
}
