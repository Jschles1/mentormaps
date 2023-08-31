"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  goal: z.string().min(2, {
    message: "Goal must be at least 2 characters.",
  }),
  mentee: z.union([z.number(), z.string()]).optional(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      goal: "",
      mentee: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roadmap Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Software Developer Roadmap"
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
                  <FormLabel>Roadmap Goal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Become a Software Developer"
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
              name="mentee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentee Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john-doe@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    <p className="mb-2">
                      The email of the mentee that you want this roadmap to be
                      for. You can choose from a list of existing user accounts.
                    </p>

                    <p>
                      Upon creation of this roadmap, they will receive an invite
                      to join. You can choose to leave this blank for now.
                    </p>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="w-full px-[1.125rem] py-4 text-[0.938rem] rounded-3xl"
            >
              Create Roadmap
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
