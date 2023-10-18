import RoadmapCard from "../roadmap-card";
import { RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";

interface RoadmapListProps {
  type: "mentee" | "mentor";
  roadmaps: RoadmapWithMilestonesAndInvites[];
}

export default function RoadmapList({ type, roadmaps }: RoadmapListProps) {
  const roadmapsLength = roadmaps.length;

  if (type === "mentee" && !roadmapsLength) {
    return (
      <div className="lg:basis-1/2">
        <p className="text-xs uppercase text-gray tracking-[2.4px] font-bold mb-6">
          Mentee Roadmaps (0)
        </p>
        <p className="text-gray text-xs mb-3">
          You currently do not belong to any roadmaps as a mentee.
        </p>
        <p className="text-gray text-xs">
          To join a roadmap as a mentee, you must receive a roadmap invite from
          your mentor. Check &quot;Roadmap Invites&quot; in the menu to see
          pending invites.
        </p>
      </div>
    );
  }

  if (type === "mentor" && !roadmapsLength) {
    return (
      <div className="mb-6 lg:basis-1/2">
        <p className="text-xs uppercase text-gray tracking-[2.4px] font-bold mb-6">
          Mentor Roadmaps (0)
        </p>
        <p className="text-gray text-xs mb-3">
          You currently do not own any roadmaps as a mentor.
        </p>
        <p className="text-gray text-xs">
          To create a roadmap as a mentor, click the &quot;+&quot; button above
          to get started.
        </p>
      </div>
    );
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
