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
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import MilestoneMenteeSolution from "./milestone-mentee-solution";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FormSubmitButton from "../form/form-submit-button";

const formSchema = z.object({
  mentorFeedbackComment: z.string().min(1, {
    message: "Please enter a comment.",
  }),
  decision: z.enum(["approve", "reject"], {
    required_error: "You must approve or reject the mentee submission.",
    invalid_type_error: "You must approve or reject the mentee submission.",
  }),
});

interface ReviewSubmissionDialogProps {
  trigger?: React.ReactNode;
  milestoneId: number;
  menteeSolutionUrl: string | null;
  menteeSolutionComment: string | null;
}

export default function ReviewSubmissionDialog({
  trigger,
  milestoneId,
  menteeSolutionComment,
  menteeSolutionUrl,
}: ReviewSubmissionDialogProps) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mentorFeedbackComment: "",
      decision: undefined,
    },
  });

  const reviewSubmissionMutation = useMutation({
    mutationFn: (variables: z.infer<typeof formSchema>) =>
      axios.patch(
        `/api/roadmaps/${params.roadmapId}/milestones/${milestoneId}`,
        {
          mentorFeedbackComment: variables.mentorFeedbackComment || "",
          decision: variables.decision,
        }
      ),
    onSuccess: async (_) => {
      console.log("API call successful.");
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Solution Review submitted!",
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
      reviewSubmissionMutation.mutate(values);
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
            <DialogTitle>Review Mentee Submission</DialogTitle>
          </DialogHeader>
          <MilestoneMenteeSolution
            isMentor
            menteeSolutionComment={menteeSolutionComment}
            menteeSolutionUrl={menteeSolutionUrl}
          />

          <Separator className="mb-2 mt-4" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="decision"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      Approve or Reject?<span className="text-orange">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="approve" />
                          </FormControl>
                          <FormLabel className="font-bold text-base text-lime">
                            Approve
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="reject" />
                          </FormControl>
                          <FormLabel className="font-bold text-base text-orange">
                            Reject
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mentorFeedbackComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Comments<span className="text-orange">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Leave comments here..."
                        error={!!errors.mentorFeedbackComment}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave any additional feeback for your mentee here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormSubmitButton isLoading={reviewSubmissionMutation.isLoading}>
                Submit
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
