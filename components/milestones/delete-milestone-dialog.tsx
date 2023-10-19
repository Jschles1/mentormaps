"use client";

import * as React from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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
import { useAuth } from "@clerk/nextjs";
import FormSubmitButton from "../form/form-submit-button/form-submit-button";

interface DeleteMilestoneDialogProps {
  milestoneId: number;
}

export default function DeleteMilestoneDialog({
  milestoneId,
}: DeleteMilestoneDialogProps) {
  const { toast } = useToast();
  const { userId } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const deleteMilestonesMutation = useMutation({
    mutationFn: () =>
      axios.delete(
        `/api/roadmaps/${params.roadmapId}/milestones/${milestoneId}`
      ),
    onSuccess: async (_) => {
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Successfully deleted milestone!",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      toast({
        title: "Something went wrong!",
        description: `Error: ${errorMessage}`,
      });
    },
  });

  function handleDelete() {
    try {
      deleteMilestonesMutation.mutate();
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen]
  );

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Milestone</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-orange text-lg">
            Delete This Milestone?
          </DialogTitle>
          <DialogDescription className="text-gray text-[0.813rem] lg:text-base leading-[1.7] py-6">
            Are you sure you want to delete this milestone? This action will
            remove all milestone progress and associated data. If this milestone
            is currently active, it will set the next milestone as active. If
            this is the only milestone, the roadmap status will be set to
            completed or pending based on the milestone status. This cannot be
            reversed.
          </DialogDescription>
          <div className="flex flex-col gap-y-4">
            <FormSubmitButton
              isLoading={deleteMilestonesMutation.isLoading}
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
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
