import { RoadmapWithMilestonesAndInvites, RoadmapData } from "@/lib/interfaces";

export const mockRoadmapData: RoadmapData = {
  title: "Software Developer Roadmap",
  mentorName: "Ben",
  roadmapId: 1,
};

export const mockRoadmap: RoadmapWithMilestonesAndInvites = {
  id: 1,
  title: "Software Developer Roadmap",
  goal: "Become a Software Developer",
  status: "Pending",
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: new Date(),
  mentorId: "1",
  menteeId: "2",
  currentMilestoneId: null,
  milestonesCompleted: null,
  milestonesTotal: null,
  milestones: [],
  RoadmapInvite: [],
};

export const mockMentorRoadmaps: RoadmapWithMilestonesAndInvites[] = [
  mockRoadmap,
  {
    id: 2,
    title: "Software Developer Roadmap 2",
    goal: "Become a Software Developer",
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: new Date(),
    completedAt: new Date(),
    mentorId: "1",
    menteeId: "3",
    currentMilestoneId: null,
    milestonesCompleted: null,
    milestonesTotal: null,
    milestones: [],
    RoadmapInvite: [],
  },
];

export const mockMenteeRoadmaps: RoadmapWithMilestonesAndInvites[] = [
  mockRoadmap,
  {
    id: 3,
    title: "Software Developer Roadmap 3",
    goal: "Become a Software Developer",
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: new Date(),
    completedAt: new Date(),
    mentorId: "2",
    menteeId: "2",
    currentMilestoneId: null,
    milestonesCompleted: null,
    milestonesTotal: null,
    milestones: [],
    RoadmapInvite: [],
  },
];
