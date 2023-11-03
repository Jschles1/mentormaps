import { Milestone } from "@prisma/client";

const milestone1: Milestone = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: new Date(),
  expectedCompletionTime: new Date(),
  attempts: 2,
  title: "Learn React",
  description: "Learn the basics of React",
  subtasks: ["Complete React tutorial", "Build a simple React app"],
  resources: ["React documentation", "React tutorial"],
  mentorFeedbackComment: "Great job!",
  menteeSolutionComment: "I struggled with this part",
  menteeSolutionUrl: "https://github.com/user/repo",
  status: "Completed",
  order: 1,
  roadmapId: 1,
};

const milestone2: Milestone = {
  id: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: new Date(),
  expectedCompletionTime: new Date(),
  attempts: 1,
  title: "Learn Node.js",
  description: "Learn the basics of Node.js",
  subtasks: ["Complete Node.js tutorial", "Build a simple Node.js app"],
  resources: ["Node.js documentation", "Node.js tutorial"],
  mentorFeedbackComment: "Good effort!",
  menteeSolutionComment: "I need more practice with this",
  menteeSolutionUrl: "https://github.com/user/repo",
  status: "Active",
  order: 2,
  roadmapId: 1,
};

const milestone3: Milestone = {
  id: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: new Date(),
  expectedCompletionTime: new Date(),
  attempts: 0,
  title: "Learn TypeScript",
  description: "Learn the basics of TypeScript",
  subtasks: ["Complete TypeScript tutorial", "Build a simple TypeScript app"],
  resources: ["TypeScript documentation", "TypeScript tutorial"],
  mentorFeedbackComment: null,
  menteeSolutionComment: null,
  menteeSolutionUrl: null,
  status: "Pending",
  order: 3,
  roadmapId: 1,
};

export const mockMilestones: Milestone[] = [milestone1, milestone2, milestone3];
