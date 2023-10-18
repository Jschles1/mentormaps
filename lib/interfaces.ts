// TODO: Remove this file and place types closer to where they are used.

import { User } from "@clerk/nextjs/server";
import { Milestone, Roadmap, RoadmapInvite } from "@prisma/client";

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

export interface RoadmapWithMilestonesAndInvites extends Roadmap {
  milestones: Milestone[];
  RoadmapInvite: RoadmapInvite[];
}
