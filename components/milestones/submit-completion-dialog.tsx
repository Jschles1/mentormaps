"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import FormSubmitButton from "../form/form-submit-button";

const urlSchema = z.string().url().optional().or(z.literal(""));

const formSchema = z.object({
  menteeSolutionComment: z.string().optional(),
  menteeSolutionUrl: urlSchema,
});

interface SubmitCompletionDialogProps {
  trigger?: React.ReactNode;
  milestoneId: number;
}

export default function SubmitCompletionDialog({
  trigger,
  milestoneId,
}: SubmitCompletionDialogProps) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menteeSolutionComment: "",
      menteeSolutionUrl: "",
    },
  });

  const submitMilestoneCompletionMutation = useMutation({
    mutationFn: (variables: z.infer<typeof formSchema>) =>
      axios.patch(
        `/api/roadmaps/${params.roadmapId}/milestones/${milestoneId}`,
        {
          menteeSolutionComment: variables.menteeSolutionComment || "",
          menteeSolutionUrl: variables.menteeSolutionUrl || "",
        }
      ),
    onSuccess: async (_) => {
      console.log("API call successful.");
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Successfully marked milestone as completed!",
        description:
          "Sit tight! Your mentor will be notified and review your submission.",
      });
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      toast({
        title: "Something went wrong!",
        description: `Error: ${errorMessage}`,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      submitMilestoneCompletionMutation.mutate(values);
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
  const isSubmitted = form.formState.isSubmitted;

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle>Complete Milestone</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="menteeSolutionComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentee Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. I completed this milestone by..."
                        error={!!errors.menteeSolutionComment}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave any comments here that describe how you completed
                      this milestone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="menteeSolutionUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solution URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Solution URL"
                        error={!!errors.menteeSolutionUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      If you have an external URL that contains the solution to
                      this milestone, please provide a link to it here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-[0.813rem] lg:text-base text-gray">
                If you would prefer to review your work for this milestone with
                your mentor outside the context of this application, you can
                leave both of these fields blank.
              </p>

              <Separator />

              <FormSubmitButton
                isLoading={submitMilestoneCompletionMutation.isLoading}
              >
                Mark as Completed
              </FormSubmitButton>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full px-[1.125rem] py-4 text-[0.938rem] lg:text-base rounded-3xl"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
