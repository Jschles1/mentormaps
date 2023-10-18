"use client";

import { Button } from "../../ui/button";
import Image from "next/image";
import AddTaskIcon from "public/images/icon-add-task-mobile.svg";
import CreateRoadMapDialog from "../../roadmaps/create-roadmap-dialog";
import { usePathname } from "next/navigation";

const WrapperComponentsByPage = {
  "/roadmaps": (props: { trigger: React.ReactNode }) => (
    <CreateRoadMapDialog {...props} />
  ),
};

export default function AddButton() {
  const pathname = usePathname();
  console.log({ pathname });
  const WrapperComponent =
    WrapperComponentsByPage[pathname as keyof typeof WrapperComponentsByPage];

  if (!WrapperComponent) {
    console.log("Returning null");
    return null;
  }

  return (
    <WrapperComponent
      trigger={
        <Button variant="default" size="sm" className="w-12 h-8 rounded-3xl">
          <Image src={AddTaskIcon} alt="Add Icon" />
        </Button>
      }
    />
  );
}
