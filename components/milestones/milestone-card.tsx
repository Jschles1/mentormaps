import { Milestone } from "@prisma/client";
import {
  CircleEllipsis,
  CheckCircle2,
  Lock,
  XCircle,
  LinkIcon,
  CircleDot,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import DeleteMilestoneDialog from "./delete-milestone-dialog";
import EditMilestoneDialog from "./edit-milestone-dialog";
import SubmitCompletionDialog from "./submit-completion-dialog";
import ReviewSubmissionDialog from "./review-submission-dialog";
import MilestoneMenteeSolution from "./milestone-mentee-solution";

interface MilestoneCardProps {
  milestone: Milestone;
  isMentor: boolean;
}

type MilestoneIconStatuses =
  | "Pending"
  | "Locked"
  | "Completed"
  | "Rejected"
  | "Pending Completion Review"
  | "Active";

const MilestoneIconsByStatus: {
  Pending: React.FC;
  Locked: React.FC;
  Completed: React.FC;
  Active: React.FC;
  Rejected: React.FC;
  "Pending Completion Review": React.FC;
} = {
  Pending: () => <CircleEllipsis size={16} color="orange" />,
  Locked: () => <Lock size={16} color="gray" />,
  Completed: () => <CheckCircle2 size={16} color="green" />,
  Active: () => <CircleDot size={16} color="green" />,
  Rejected: () => <XCircle size={16} color="red" />,
  "Pending Completion Review": () => (
    <CircleEllipsis size={16} color="orange" />
  ),
};

function getResourceData(resource: string) {
  const splitString = resource.split("___***___");
  return {
    name: splitString[0],
    href: splitString[1],
  };
}

export default function MilestoneCard({
  milestone,
  isMentor,
}: MilestoneCardProps) {
  const {
    title,
    description,
    status,
    subtasks,
    resources,
    id,
    menteeSolutionComment,
    menteeSolutionUrl,
  } = milestone;
  let milestoneStatus: MilestoneIconStatuses = status as MilestoneIconStatuses;
  const isMilestoneLocked = status === "Pending" && !isMentor;
  const isPendingReview = status === "PendingCompletionReview" && isMentor;
  const isCompletionSubmitted =
    status === "PendingCompletionReview" && !isMentor;
  if (status === "PendingCompletionReview") {
    milestoneStatus = "Pending Completion Review";
  }
  if (isMilestoneLocked) {
    milestoneStatus = "Locked";
  }
  const MilestoneIcon = MilestoneIconsByStatus[milestoneStatus];

  return (
    <Card
      className={cn(
        "px-4 py-6 border-0 relative z-10",
        isMilestoneLocked && "bg-light-blue-gray"
      )}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="border-0" value="item-1">
          <AccordionTrigger
            className="p-0 decoration-transparent"
            disabled={isMilestoneLocked}
          >
            <div className="flex items-center gap-x-4">
              <MilestoneIcon />
              <p
                className={cn(
                  "text-[0.938rem] lg:text-base text-black-darkest",
                  isMilestoneLocked && "text-gray"
                )}
              >
                {title}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 [&>div]:pb-0 [&>div]:flex [&>div]:flex-col [&>div]:gap-y-4">
            <p className="text-gray">{description}</p>

            <div>
              <p className="text-xs text-gray">Status</p>
              <p className="text-sm text-black-darkest font-bold">
                {milestoneStatus}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray mb-2">Subtasks</p>
              {!subtasks.length && (
                <p className="text-sm text-black-darkest font-bold -mt-2">
                  N/A
                </p>
              )}
              <div className="flex flex-col gap-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask}
                    className="max-w-[calc(100vw-4rem)] overflow-hidden flex items-center gap-x-2"
                  >
                    <div className="flex flex-1 items-center gap-x-2 px-4 py-4 relative bg-lighter-blue-gray rounded-md ">
                      <CheckCircle2 className="text-dark-lavender" size={16} />
                      <p className="text-xs flex-1 text-black-darkest text-bold overflow-x-hidden break-words max-w-[calc(100vw-11rem)]">
                        {subtask}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray mb-2">Resources</p>
              {!resources.length && (
                <p className="text-sm text-black-darkest font-bold -mt-2">
                  N/A
                </p>
              )}
              <div className="flex flex-col gap-y-2">
                {!!resources.length &&
                  resources.map((resource) => (
                    <div
                      key={resource}
                      className="max-w-[calc(100vw-4rem)] overflow-hidden flex items-center gap-x-2"
                    >
                      <div className="flex flex-1 items-center gap-x-2 px-4 py-4 relative bg-lighter-blue-gray rounded-md ">
                        <LinkIcon className="text-dark-lavender" size={16} />
                        <Link
                          href={getResourceData(resource).href}
                          target="_blank"
                          className="text-xs underline flex-1 text-black-darkest text-bold overflow-x-hidden break-words max-w-[calc(100vw-11rem)]"
                        >
                          {getResourceData(resource).name}
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>

              {(isCompletionSubmitted || milestoneStatus === "Completed") && (
                <>
                  <Separator className="my-4" />
                  <MilestoneMenteeSolution
                    isMentor={false}
                    menteeSolutionComment={menteeSolutionComment}
                    menteeSolutionUrl={menteeSolutionUrl}
                  />
                </>
              )}

              <Separator className="my-4" />

              <div className="flex flex-col gap-y-2">
                {/* Mentor Options or Mentee Options */}
                {isMentor ? (
                  <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
                    {isPendingReview && (
                      <ReviewSubmissionDialog
                        milestoneId={id}
                        menteeSolutionComment={menteeSolutionComment}
                        menteeSolutionUrl={menteeSolutionUrl}
                        trigger={
                          <Button variant="secondary">
                            Review Mentee Submission
                          </Button>
                        }
                      />
                    )}
                    <EditMilestoneDialog
                      milestone={milestone}
                      trigger={<Button>Edit Milestone</Button>}
                    />
                    <DeleteMilestoneDialog milestoneId={id} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
                    {status === "PendingCompletionReview" && (
                      <Button variant="secondary" disabled>
                        Pending Mentor Review...
                      </Button>
                    )}
                    {(status === "Active" || status === "Rejected") && (
                      <SubmitCompletionDialog
                        milestoneId={id}
                        trigger={
                          <Button variant="secondary">Mark as Completed</Button>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
