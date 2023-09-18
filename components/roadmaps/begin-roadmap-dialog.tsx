"use client";

import * as React from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import FormSubmitButton from "../form/form-submit-button";

interface BeginRoadmapDialogProps {
  trigger?: React.ReactNode;
}

export default function BeginRoadmapDialog({
  trigger,
}: BeginRoadmapDialogProps) {
  const { toast } = useToast();
  const { userId } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const beginRoadmapMutation = useMutation({
    mutationFn: () => axios.post(`/api/roadmaps/${params.roadmapId}/start`),
    onSuccess: async (_) => {
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Roadmap is now active!",
      });
    },
    onError: (error: any) => {},
  });

  function handleBeginRoadmap() {
    try {
      beginRoadmapMutation.mutate();
    } catch (error) {
      console.log(error);
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Begin This Roadmap?</DialogTitle>
          <DialogDescription className="text-gray text-[0.813rem] leading-[1.7] py-6">
            Are you sure you want to begin this roadmap? This action will set
            the roadmap status and first milestone status to be
            &quot;Active&quot;. This cannot be reversed.
          </DialogDescription>
          <div className="flex flex-col gap-y-4">
            <FormSubmitButton
              onClick={handleBeginRoadmap}
              isLoading={beginRoadmapMutation.isLoading}
            >
              Begin
            </FormSubmitButton>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
