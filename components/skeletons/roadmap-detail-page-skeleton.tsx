import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-y-4">
      {/* {Main roadmap card} */}
      <Skeleton className="bg-light-blue-gray h-80" />
      {/* Milestone stats */}
      <Skeleton className="bg-light-blue-gray h-24" />
      {/* Milestones */}
      <div className="flex flex-col gap-y-4 relative">
        <Skeleton className="bg-light-blue-gray h-20" />
        <Skeleton className="bg-light-blue-gray h-20" />
        <Skeleton className="bg-light-blue-gray h-20" />
        <div
          className="border-light-blue-gray border-l-8 h-full text-transparent absolute left-5"
          aria-hidden
        ></div>
      </div>
    </div>
  );
}
