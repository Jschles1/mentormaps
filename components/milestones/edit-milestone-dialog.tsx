"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, X, LinkIcon } from "lucide-react";
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
import { Milestone } from "@prisma/client";

const urlSchema = z.string().url().optional().or(z.literal(""));

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required.",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is required.",
    })
    .min(2, {
      message: "Description must be at least 2 characters.",
    }),
  currentSubtask: z.string().optional(),
  currentResourceName: z.string().optional(),
  currentResourceHref: urlSchema,
  subtasks: z.array(z.string()).optional(),
  resources: z
    .array(
      z.object({
        name: z.string().optional(),
        href: urlSchema,
      })
    )
    .optional(),
});

function MilestoneSubtask({
  subtask,
  onRemove,
}: {
  subtask: string;
  onRemove: () => void;
}) {
  return (
    <div className="max-w-[calc(100vw-5rem)] overflow-hidden flex items-center gap-x-2">
      <div className="flex flex-1 items-center justify-between gap-x-2 px-4 py-4 relative bg-lighter-blue-gray rounded-md ">
        <CheckCircle2 className="text-dark-lavender" size={16} />
        <p className="text-xs flex-1 text-black-darkest text-bold overflow-x-hidden break-words max-w-[calc(100vw-11rem)]">
          {subtask}
        </p>
        <Button
          type="button"
          variant="ghost"
          className="p-0 h-auto"
          onClick={onRemove}
        >
          <X className="text-dark-lavender" size={16} />
        </Button>
      </div>
    </div>
  );
}

function MilestoneResource({
  name,
  href,
  onRemove,
}: {
  name: string;
  href: string;
  onRemove: () => void;
}) {
  return (
    <div className="max-w-[calc(100vw-5rem)] overflow-hidden flex items-center gap-x-2">
      <div className="flex flex-1 items-center justify-between gap-x-2 px-4 py-4 relative bg-lighter-blue-gray rounded-md ">
        <LinkIcon className="text-dark-lavender" size={16} />
        <Link
          href={href}
          target="_blank"
          className="text-xs underline flex-1 text-black-darkest text-bold overflow-x-hidden break-words max-w-[calc(100vw-11rem)]"
        >
          {name}
        </Link>
        <Button
          type="button"
          variant="ghost"
          className="p-0 h-auto"
          onClick={onRemove}
        >
          <X className="text-dark-lavender" size={16} />
        </Button>
      </div>
    </div>
  );
}

function parseMilestoneResources(resources: string[]) {
  return resources.map((resource) => {
    const [name, href] = resource.split("___***___");
    return { name, href };
  });
}

interface EditMilestoneDialogProps {
  trigger?: React.ReactNode;
  menteeId?: string;
  milestone: Milestone;
}

export default function EditMilestoneDialog({
  trigger,
  menteeId,
  milestone,
}: EditMilestoneDialogProps) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: milestone.title,
      description: milestone.description,
      currentSubtask: "",
      currentResourceName: "",
      currentResourceHref: "",
      subtasks: milestone.subtasks || [],
      resources: parseMilestoneResources(milestone.resources) || [],
    },
  });

  form.watch("subtasks");
  form.watch("resources");

  const updateMilestoneMutation = useMutation({
    mutationFn: (variables: z.infer<typeof formSchema>) =>
      axios.patch(
        `/api/roadmaps/${params.roadmapId}/milestones/${milestone.id}`,
        {
          title: variables.title,
          description: variables.description,
          subtasks: variables.subtasks,
          resources: variables.resources,
          menteeId: menteeId || "",
        }
      ),
    onSuccess: async (_) => {
      console.log("Update API call successful.");
      setIsOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["roadmap", params.roadmapId, userId],
      });
      toast({
        title: "Successfully updated milestone!",
      });
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data;
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      updateMilestoneMutation.mutate(values);
    } catch (error) {
      // For preventing unhandled promise rejection
    }
  }

  function handleAddSubtask() {
    const currentSubtask = form.getValues("currentSubtask");
    const subtasks = form.getValues("subtasks") || [];
    if (currentSubtask) {
      form.setValue("subtasks", [...subtasks, currentSubtask]);
      form.resetField("currentSubtask");
    } else {
      form.setError("currentSubtask", {
        type: "manual",
        message: "Subtask is required.",
      });
    }
  }

  function handleRemoveSubtask(subtask: string) {
    const subtasks = form.getValues("subtasks") || [];
    form.setValue(
      "subtasks",
      subtasks.filter((s) => s !== subtask)
    );
  }

  function handleAddResource() {
    const currentResourceName = form.getValues("currentResourceName");
    const currentResourceHref = form.getValues("currentResourceHref");
    let areFieldsPresent = true;

    if (!currentResourceName) {
      form.setError("currentResourceName", {
        type: "manual",
        message: "Resource name is required.",
      });
      areFieldsPresent = false;
    }

    if (!currentResourceHref) {
      form.setError("currentResourceHref", {
        type: "manual",
        message: "Resource URL is required.",
      });
      areFieldsPresent = false;
    }

    if (!areFieldsPresent) {
      return;
    }

    const urlValidation = urlSchema.safeParse(currentResourceHref);
    if (!urlValidation.success) {
      form.setError("currentResourceHref", {
        type: "manual",
        message: "Invalid URL.",
      });
      return;
    }

    const resources = form.getValues("resources") || [];
    form.setValue("resources", [
      ...resources,
      { name: currentResourceName, href: currentResourceHref },
    ]);
    form.resetField("currentResourceName");
    form.resetField("currentResourceHref");
  }

  function handleRemoveResource(name: string) {
    const resources = form.getValues("resources") || [];
    form.setValue(
      "resources",
      resources.filter((r) => r.name !== name)
    );
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  }

  const errors = form.formState.errors;
  const isSubmitted = form.formState.isSubmitted;
  const enteredSubtasks = form.getValues("subtasks") || [];
  const enteredResources = form.getValues("resources") || [];

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle>Update Milestone</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Learn JavaScript Basics"
                        error={!!errors.title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of this milestone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Learn JavaScript basics such as variables, functions, and objects."
                        error={!!errors.description}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The intended outcome you want from your mentee completing
                      this milestone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentSubtask"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-gray">
                      Subtasks
                    </FormLabel>
                    {!!enteredSubtasks.length && (
                      <div className="flex flex-col gap-y-2 mb-2">
                        {enteredSubtasks.map((subtask) => (
                          <MilestoneSubtask
                            key={subtask}
                            subtask={subtask}
                            onRemove={() => handleRemoveSubtask(subtask)}
                          />
                        ))}
                      </div>
                    )}
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Input
                          className="flex-1"
                          placeholder="e.g. Learn JavaScript variables"
                          autoComplete="off"
                          error={!!errors.currentSubtask}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddSubtask}
                        >
                          Add
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add any subtasks here that can help your mentee complete
                      this milestone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <p className="text-xs leading-none text-gray">Resources</p>
                {!!enteredResources.length && (
                  <div className="flex flex-col gap-y-2 mb-2">
                    {enteredResources.map((resource) => (
                      <MilestoneResource
                        key={resource.name}
                        name={resource.name as string}
                        href={resource.href as string}
                        onRemove={() =>
                          handleRemoveResource(resource.name as string)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="currentResourceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-gray sr-only">
                      Resource Name
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Input
                          className="flex-1"
                          placeholder="Resource Name"
                          autoComplete="off"
                          error={!!errors.currentResourceName}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="sr-only">
                      Name of the resource.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentResourceHref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-gray sr-only">
                      Resource URL
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Input
                          className="flex-1"
                          placeholder="Resource URL"
                          autoComplete="off"
                          error={!!errors.currentResourceName}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="sr-only">
                      URL of the resource.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-[0.813rem] text-gray">
                Add any external resources that can help your mentee complete
                this milestone. A resource requires a display name and URL.
              </p>

              <Button
                type="button"
                variant="secondary"
                className="w-full px-[1.125rem] py-4 text-[0.938rem] rounded-3xl"
                onClick={handleAddResource}
              >
                Add Resource
              </Button>

              <Separator />

              <Button
                type="submit"
                variant="default"
                size="sm"
                className="w-full px-[1.125rem] py-4 text-[0.938rem] rounded-3xl"
              >
                Update Milestone
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full px-[1.125rem] py-4 text-[0.938rem] rounded-3xl"
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
