"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useParams } from "next/navigation";
import FormSubmitButton from "../form/form-submit-button";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required.",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    }),
  goal: z
    .string()
    .min(1, {
      message: "Goal is required.",
    })
    .min(2, {
      message: "Goal must be at least 2 characters.",
    }),
});

interface EditRoadmapDialogProps {
  title: string;
  goal: string;
  closePopover: () => void;
}

type FormValues = z.infer<typeof formSchema>;

export default function EditRoadmapDialog({
  title,
  goal,
  closePopover,
}: EditRoadmapDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const params = useParams();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      goal,
    },
  });

  const updateRoadmapMutation = useMutation({
    mutationFn: (variables: FormValues) =>
      axios.patch(`/api/roadmaps/${params.roadmapId}`, {
        title: variables.title,
        goal: variables.goal,
      }),
    onSuccess: async (_) => {
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Successfully updated Roadmap!",
      });
      closePopover();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      toast({
        title: "Something went wrong!",
        description: `Error: ${errorMessage}`,
      });
    },
  });

  function onSubmit(values: FormValues) {
    try {
      updateRoadmapMutation.mutate(values);
    } catch (error) {
      // For preventing unhandled promise rejection
    }
  }

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        form.reset();
      }
    },
    [setIsOpen, form]
  );

  const errors = form.formState.errors;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Edit Roadmap</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Roadmap</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Roadmap Title<span className="text-orange">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Software Developer Roadmap"
                      error={!!errors.title}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The title of this roadmap.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Roadmap Goal<span className="text-orange">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Become a Software Developer"
                      error={!!errors.goal}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The intended goal of this roadmap.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmitButton isLoading={updateRoadmapMutation.isLoading}>
              Update Roadmap
            </FormSubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
