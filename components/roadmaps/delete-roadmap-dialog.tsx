"use client";

import * as React from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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

export default function DeleteRoadmapDialog() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const deleteRoadmapMutation = useMutation({
    mutationFn: () => axios.delete(`/api/roadmaps/${params.roadmapId}`),
    onSuccess: async (_) => {
      await router.push("/roadmaps");
      setIsOpen(false);
      await queryClient.refetchQueries({ queryKey: ["roadmaps"] });
      toast({
        title: "Successfully deleted Roadmap!",
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
      deleteRoadmapMutation.mutate();
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
        <Button variant="destructive">Delete Roadmap</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-orange text-lg">
            Delete This Roadmap?
          </DialogTitle>
          <DialogDescription className="text-gray text-[0.813rem] lg:text-base leading-[1.7] py-6">
            Are you sure you want to delete this roadmap? This action will
            remove all mentee progress and associated data. This cannot be
            reversed.
          </DialogDescription>
          <div className="flex flex-col gap-y-4">
            <FormSubmitButton
              type="button"
              variant="destructive"
              onClick={handleDelete}
              isLoading={deleteRoadmapMutation.isLoading}
            >
              Delete
            </FormSubmitButton>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={deleteRoadmapMutation.isLoading}
            >
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
