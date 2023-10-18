import { RoadmapInvite } from "@prisma/client";

export const mockRoadmapInvites: RoadmapInvite[] = [
  {
    id: 1,
    mentorId: "2",
    menteeId: "1",
    menteeName: "Mentee 1",
    roadmapId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    mentorId: "2",
    menteeId: "2",
    menteeName: "Mentee 2",
    roadmapId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
