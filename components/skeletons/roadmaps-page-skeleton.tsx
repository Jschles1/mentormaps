import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapsPageSkeleton() {
  return (
    <div className="lg:flex lg:items-start lg:gap-x-4">
      <div className="mb-6 lg:basis-1/2">
        <div className="flex flex-col gap-x-2 mb-6">
          <Skeleton className="h-4 bg-light-blue-gray" />
        </div>
        <div className="flex flex-col gap-y-4">
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
        </div>
      </div>
      <div className="mb-6 lg:basis-1/2">
        <div className="flex flex-col gap-x-2 mb-6">
          <Skeleton className="h-4 bg-light-blue-gray" />
        </div>
        <div className="flex flex-col gap-y-4">
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
          <Skeleton className="rounded-lg h-24 bg-light-blue-gray" />
        </div>
      </div>
    </div>
  );
}
