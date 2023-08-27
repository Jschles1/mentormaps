"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

interface CreateRoadMapDialogProps {
  triggerClassName?: string;
  triggerText?: string;
}

export default function CreateRoadMapDialog({
  triggerClassName,
  triggerText,
}: CreateRoadMapDialogProps) {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  function handleClick() {
    console.log("clicked");
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger className={triggerClassName} onClick={handleClick}>
        {triggerText}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] rounded-[6px]">
        <DialogHeader>
          <DialogTitle className="text-black-darkest">
            Add New Roadmap
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
