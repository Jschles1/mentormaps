import { User } from "@clerk/nextjs/server";
import { Milestone, Roadmap } from "@prisma/client";

export interface RoadmapData {
  roadmapId: number;
  mentorName: string;
  title: string;
}

export interface RoadmapInviteData {
  roadmap: Roadmap;
  mentor: User;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export interface RoadmapWithMilestones extends Roadmap {
  milestones: Milestone[];
}
