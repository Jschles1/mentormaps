import {
  RoadmapWithMilestonesAndInvites,
  RoadmapData,
  UserInfo,
} from "@/lib/interfaces";
import { mockMilestones } from "./milestones";
import { mockMentor, mockMentee } from "./users";

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

export const mockMentorRoadmapDetails = {
  roadmap: mockRoadmap,
  milestones: mockMilestones,
  currentUser: {
    id: mockMentor.id,
    firstName: mockMentor.firstName,
    lastName: mockMentor.lastName,
  },
  otherUser: {
    id: mockMentee.id,
    firstName: mockMentee.firstName,
    lastName: mockMentee.lastName,
  },
  isMentor: true,
};

export const mockMenteeRoadmapDetails = {
  roadmap: mockRoadmap,
  milestones: mockMilestones,
  otherUser: {
    id: mockMentor.id,
    firstName: mockMentor.firstName,
    lastName: mockMentor.lastName,
  },
  currentUser: {
    id: mockMentee.id,
    firstName: mockMentee.firstName,
    lastName: mockMentee.lastName,
  },
  isMentor: false,
};
