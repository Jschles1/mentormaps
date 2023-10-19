"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
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
import { cn } from "@/lib/utils";
import FormSubmitButton from "../form/form-submit-button/form-submit-button";

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
  menteeEmail: z.string().email().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRoadMapDialogProps {
  trigger?: React.ReactNode;
}

export default function CreateRoadMapDialog({
  trigger,
}: CreateRoadMapDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      goal: "",
      menteeEmail: "",
    },
  });

  const createRoadmapMutation = useMutation({
    mutationFn: (variables: FormValues) =>
      axios.post("/api/create-roadmap", {
        title: variables.title,
        goal: variables.goal,
        menteeEmail: variables?.menteeEmail?.trim(),
      }),
    onSuccess: (_) => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      toast({
        title: "Successfully created Roadmap!",
        description: "You can now start adding milestones to your roadmap.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      if (errorMessage === "Mentee email doesn't exist") {
        form.setError("menteeEmail", {
          type: "manual",
          message: "Mentee email doesn't exist.",
        });
      } else {
        toast({
          title: "Something went wrong!",
          description: `Error: ${errorMessage}`,
        });
      }
    },
  });

  function onSubmit(values: FormValues) {
    try {
      createRoadmapMutation.mutate(values);
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
        <DialogHeader>
          <DialogTitle>Add New Roadmap</DialogTitle>
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
            <FormField
              control={form.control}
              name="menteeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentee Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john-doe@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The email of the mentee that you want this roadmap to be
                    for. If the entered email exists, the mentee will receive an
                    invite to join the roadmap upon creation. You can choose to
                    leave this blank for now.
                  </FormDescription>
                  <FormMessage className={cn(!isSubmitted && "hidden")} />
                </FormItem>
              )}
            />
            <FormSubmitButton isLoading={createRoadmapMutation.isLoading}>
              Create Roadmap
            </FormSubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
