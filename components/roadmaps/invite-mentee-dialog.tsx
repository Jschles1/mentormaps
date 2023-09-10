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
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  menteeEmail: z.string().email(),
  roadmapId: z.string(),
});

interface InviteMenteeDialogProps {
  trigger?: React.ReactNode;
  roadmapId: number | string;
}

export default function InviteMenteeDialog({
  trigger,
  roadmapId,
}: InviteMenteeDialogProps) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menteeEmail: "",
      roadmapId: roadmapId.toString(),
    },
  });

  const inviteMenteeMutation = useMutation({
    mutationFn: (variables: z.infer<typeof formSchema>) =>
      axios.post("/api/roadmap-invites/send-invite", {
        menteeEmail: variables?.menteeEmail?.trim(),
        roadmapId: variables?.roadmapId,
      }),
    onSuccess: (_) => {
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["roadmap", roadmapId, userId],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
      if (errorMessage === "Mentee email doesn't exist") {
        form.setError("menteeEmail", {
          type: "manual",
          message: "Mentee email doesn't exist.",
        });
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      inviteMenteeMutation.mutate(values);
    } catch (error) {
      // For preventing unhandled promise rejection
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset({ menteeEmail: "", roadmapId: roadmapId.toString() });
    }
  }

  const errors = form.formState.errors;
  const isSubmitted = form.formState.isSubmitted;

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Mentee</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    invite to join the roadmap.
                  </FormDescription>
                  <FormMessage className={cn(!isSubmitted && "hidden")} />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="w-full px-[1.125rem] py-4 text-[0.938rem] rounded-3xl"
            >
              Send Invite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
