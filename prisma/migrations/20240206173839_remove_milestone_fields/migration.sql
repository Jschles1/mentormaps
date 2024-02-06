-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('Pending', 'Active', 'Completed');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('Pending', 'PendingCompletionReview', 'Active', 'Rejected', 'Completed');

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "status" "RoadmapStatus" NOT NULL DEFAULT 'Pending',
    "currentMilestoneId" INTEGER,
    "milestonesCompleted" INTEGER DEFAULT 0,
    "milestonesTotal" INTEGER DEFAULT 0,
    "mentorId" TEXT,
    "menteeId" TEXT,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subtasks" TEXT[],
    "resources" TEXT[],
    "mentorFeedbackComment" TEXT,
    "menteeSolutionComment" TEXT,
    "menteeSolutionUrl" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'Pending',
    "order" INTEGER NOT NULL,
    "roadmapId" INTEGER,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapInvite" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roadmapId" INTEGER,
    "menteeName" TEXT NOT NULL,
    "mentorId" TEXT,
    "menteeId" TEXT,

    CONSTRAINT "RoadmapInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapInvite" ADD CONSTRAINT "RoadmapInvite_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
