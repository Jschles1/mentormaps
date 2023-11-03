/**
 * @jest-environment node
 */

import { POST } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";
import { mockMentorRoadmaps } from "@/__mocks__/roadmaps";
import { mockMilestones } from "@/__mocks__/milestones";

jest.mock("@/lib/prisma-db", () => {
  return {
    __esModule: true,
    default: {
      roadmap: {
        findFirst: jest.fn(() => {
          return mockMentorRoadmaps[0];
        }),
        update: jest.fn(() => {
          return mockMentorRoadmaps[0];
        }),
      },
      milestone: {
        findMany: jest.fn(() => {
          return mockMilestones;
        }),
        update: jest.fn(() => {
          return mockMilestones[0];
        }),
      },
      notification: {
        create: jest.fn(),
      },
    },
  };
});

describe("POST /api/roadmaps/:roadmapId/start", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 401 if roadmap does not exist", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockReturnValueOnce(null);
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Roadmap does not exist");
  });

  it("Should return 400 if roadmap is already active", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockReturnValueOnce({
      ...mockMentorRoadmaps[0],
      status: "Active",
    });
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Roadmap is already active");
  });

  it("Should return 400 if roadmap does not have a mentee", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockReturnValueOnce({
      ...mockMentorRoadmaps[0],
      menteeId: null,
    });
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe(
      "Roadmap cannot be started without mentee"
    );
  });

  it("Should return 400 if roadmap does not have any milestones", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockReturnValueOnce({
      ...mockMentorRoadmaps[0],
      milestones: [],
    });
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe(
      "Roadmap cannot be started without milestones"
    );
  });

  it("Should update roadmap status to Active and set first milestone to Active", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockReturnValueOnce({
      ...mockMentorRoadmaps[0],
      milestones: [mockMilestones],
    });
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
    expect(prismadb.roadmap.update).toHaveBeenCalledWith({
      where: {
        id: 1,
        mentorId: "123",
      },
      data: {
        status: "Active",
      },
    });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        status: "Active",
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "2",
        message: `Your mentor has started the Software Developer Roadmap roadmap!`,
      },
    });
  });

  it("should return 500 if an error occurs", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    const req = {} as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
