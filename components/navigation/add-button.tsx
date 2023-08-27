"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import AddTaskIcon from "public/images/icon-add-task-mobile.svg";

export default function AddButton() {
  return (
    <Button className="w-12 h-8 bg-dark-lavender focus-within:bg-light-lavender focus:bg-light-lavender active:bg-light-lavender hover:bg-light-lavender text-white rounded-3xl">
      <Image src={AddTaskIcon} alt="Add Icon" />
    </Button>
  );
}
