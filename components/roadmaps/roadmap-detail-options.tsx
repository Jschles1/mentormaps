import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";
import EditRoadmapDialog from "./edit-roadmap-dialog";
import DeleteRoadmapDialog from "./delete-roadmap-dialog";

export default function RoadmapDetailOptions() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-lighter-blue-gray focus:bg-lighter-blue-gray focus-within:bg-lighter-blue-gray focus-visible:bg-lighter-blue-gray active:bg-lighter-blue-gray"
        >
          <Image src={IconVerticalEllipsis} alt="Roadmap Options" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-y-4">
        <EditRoadmapDialog />
        <DeleteRoadmapDialog />
      </PopoverContent>
    </Popover>
  );
}
