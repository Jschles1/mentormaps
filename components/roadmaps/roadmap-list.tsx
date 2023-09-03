import { Roadmap } from "@prisma/client";

interface RoadmapsListProps {
  type: "mentee" | "mentor";
  roadmaps: Roadmap[];
}

export default function RoadmapsList({ type, roadmaps }: RoadmapsListProps) {
  const title = type === "mentee" ? "Mentee Roadmaps" : "Mentor Roadmaps";
  return (
    <div>
      <div className="flex items-center gap-x-2 mb-6">
        <p className="text-xs uppercase text-gray tracking-[2.4px] font-bold">
          {title}
        </p>
      </div>
    </div>
  );
}
