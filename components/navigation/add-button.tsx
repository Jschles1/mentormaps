"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import AddTaskIcon from "public/images/icon-add-task-mobile.svg";

export default function AddButton() {
  // TODO: Determine modal to open based on current page
  return (
    <Button variant="default" size="sm" className="w-12 h-8 rounded-3xl">
      <Image src={AddTaskIcon} alt="Add Icon" />
    </Button>
  );
}
