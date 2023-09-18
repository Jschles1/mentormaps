import { Roadmap } from "@prisma/client";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";

interface RoadmapCardProps {
  roadmap: RoadmapWithMilestonesAndInvites;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const { title, milestones, id } = roadmap;

  const completedMilestones = milestones?.filter(
    (milestone) => milestone.status === "Completed"
  ).length;

  const milestonesCompletedMessage = `${completedMilestones} of ${milestones.length} milestones completed`;

  return (
    <Link href={`/roadmaps/${id}`}>
      <Card className="px-4 py-6 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-[0.938rem] lg:text-base text-black-darkest">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-gray">
            {milestonesCompletedMessage}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
