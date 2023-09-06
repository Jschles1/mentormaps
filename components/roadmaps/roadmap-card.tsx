import { Roadmap } from "@prisma/client";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const { title, milestonesCompleted, milestonesTotal, id } = roadmap;

  const milestonesCompletedMessage = `${milestonesCompleted} of ${milestonesTotal} milestones completed`;

  return (
    <Link href={`/roadmaps/${id}`}>
      <Card className="px-4 py-6 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-[0.938rem] text-black-darkest">
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
